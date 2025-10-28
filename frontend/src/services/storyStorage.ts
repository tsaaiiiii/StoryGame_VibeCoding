const DB_NAME = 'vibe-story-progress';
const DB_VERSION = 1;
const STORE_NAME = 'story_snapshots';

export interface StorySnapshot {
  sessionId: string;
  theme: string;
  progress: number;
  key_points: string[];
  pending_threads: string[];
  tone: string;
  memory_summary: string;
  last_action_summary: string;
  player_action: string;
  visible_text: string;
  system_text: string;
  updated_at: string;
}

interface StoredStorySnapshot extends StorySnapshot {
  created_at: string;
}

type DbInstance = IDBDatabase | null;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not available in this environment'));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'sessionId' });
          store.createIndex('by-theme', 'theme', { unique: false });
          store.createIndex('by-updated_at', 'updated_at', { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'));
    });
  }

  return dbPromise;
}

function toPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
  });
}

function sanitizeList(values: string[] | undefined): string[] {
  if (!Array.isArray(values)) {
    return [];
  }
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    if (typeof value !== 'string') {
      continue;
    }
    const trimmed = value.trim();
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed);
      result.push(trimmed);
    }
  }
  return result;
}

function normalizeSnapshot(snapshot: StorySnapshot | StoredStorySnapshot): StorySnapshot {
  return {
    sessionId: snapshot.sessionId,
    theme: snapshot.theme,
    progress: Number.isFinite(snapshot.progress) ? Math.max(0, Math.min(100, Math.round(snapshot.progress))) : 0,
    key_points: sanitizeList(snapshot.key_points),
    pending_threads: sanitizeList(snapshot.pending_threads),
    tone: snapshot.tone || '',
    memory_summary: snapshot.memory_summary || '',
    last_action_summary: snapshot.last_action_summary || '',
    player_action: snapshot.player_action || '',
    visible_text: snapshot.visible_text || '',
    system_text: snapshot.system_text || '',
    updated_at: snapshot.updated_at || new Date().toISOString(),
  };
}

async function readRecord(sessionId: string): Promise<StoredStorySnapshot | undefined> {
  const db = await openDatabase();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const record = await toPromise(store.get(sessionId));
  await transactionComplete(tx);
  return record ?? undefined;
}

async function writeRecord(record: StoredStorySnapshot): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.put(record);
  await transactionComplete(tx);
}

async function transactionComplete(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('IndexedDB transaction failed'));
    tx.onabort = () => reject(tx.error ?? new Error('IndexedDB transaction aborted'));
  });
}

export async function saveStorySnapshot(snapshot: StorySnapshot): Promise<StorySnapshot> {
  const existing = await readRecord(snapshot.sessionId);
  const now = new Date().toISOString();
  const normalized = normalizeSnapshot(snapshot);

  const record: StoredStorySnapshot = {
    created_at: existing?.created_at ?? now,
    ...normalized,
    updated_at: normalized.updated_at || now,
  };

  await writeRecord(record);
  return normalizeSnapshot(record);
}

export async function updateStorySnapshot(sessionId: string, updates: Partial<StorySnapshot>): Promise<StorySnapshot | undefined> {
  const existing = await readRecord(sessionId);
  if (!existing) {
    return undefined;
  }

  const merged: StorySnapshot = normalizeSnapshot({
    ...existing,
    ...updates,
    sessionId,
    updated_at: updates.updated_at || new Date().toISOString(),
  });

  await writeRecord({ ...existing, ...merged });
  return merged;
}

export async function loadStorySnapshot(sessionId: string): Promise<StorySnapshot | undefined> {
  const record = await readRecord(sessionId);
  return record ? normalizeSnapshot(record) : undefined;
}

export async function loadAllStorySnapshots(): Promise<StorySnapshot[]> {
  const db = await openDatabase();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const index = store.index('by-updated_at');
  const records = await toPromise(index.getAll());
  await transactionComplete(tx);
  return records
    .map(normalizeSnapshot)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export async function deleteStorySnapshot(sessionId: string): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.delete(sessionId);
  await transactionComplete(tx);
}

export async function clearStorySnapshots(): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  store.clear();
  await transactionComplete(tx);
}

export async function loadStoryContext(sessionId: string): Promise<{
  visible_text: string;
  system_text: string;
  player_action: string;
  memory_summary: string;
  last_action_summary: string;
} | null> {
  const snapshot = await loadStorySnapshot(sessionId);
  if (!snapshot) {
    return null;
  }
  return {
    visible_text: snapshot.visible_text,
    system_text: snapshot.system_text,
    player_action: snapshot.player_action,
    memory_summary: snapshot.memory_summary,
    last_action_summary: snapshot.last_action_summary,
  };
}

export async function upsertFromApiPayload(payload: {
  sessionId: string;
  theme: string;
  progress?: number;
  keyPoints?: string[];
  pendingThreads?: string[];
  tone?: string;
  memorySummary?: string;
  playerAction?: string;
  visible?: string;
  system?: string;
  updatedAt?: string;
  lastActionSummary?: string;
}): Promise<StorySnapshot> {
  const snapshot: StorySnapshot = normalizeSnapshot({
    sessionId: payload.sessionId,
    theme: payload.theme,
    progress: payload.progress ?? 0,
    key_points: payload.keyPoints ?? [],
    pending_threads: payload.pendingThreads ?? [],
    tone: payload.tone ?? '',
    memory_summary: payload.memorySummary ?? '',
    player_action: payload.playerAction ?? '',
    visible_text: payload.visible ?? '',
    system_text: payload.system ?? '',
    last_action_summary: payload.lastActionSummary ?? '',
    updated_at: payload.updatedAt ?? new Date().toISOString(),
  });
  return saveStorySnapshot(snapshot);
}

export async function exportStorySnapshots(): Promise<StorySnapshot[]> {
  return loadAllStorySnapshots();
}

export type StoryStorageModule = {
  saveStorySnapshot: typeof saveStorySnapshot;
  updateStorySnapshot: typeof updateStorySnapshot;
  loadStorySnapshot: typeof loadStorySnapshot;
  loadAllStorySnapshots: typeof loadAllStorySnapshots;
  deleteStorySnapshot: typeof deleteStorySnapshot;
  clearStorySnapshots: typeof clearStorySnapshots;
  loadStoryContext: typeof loadStoryContext;
  upsertFromApiPayload: typeof upsertFromApiPayload;
  exportStorySnapshots: typeof exportStorySnapshots;
};
