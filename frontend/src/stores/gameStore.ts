import { defineStore } from 'pinia';
import type { GameStatePayload, StartGameRequest, StorySegment, StoryLogEntry } from '../services/api';
import { startGame, submitTurn, fetchState } from '../services/api';

type StoryLength = 'short' | 'medium' | 'long';
type Status = 'idle' | 'in-progress' | 'completed';

interface GameState {
  sessionId: string;
  theme: string;
  length: StoryLength;
  gender: 'male' | 'female';
  turn: number;
  maxTurns: number;
  status: Status;
  storyLog: StoryLogEntry[];
  latest: StorySegment | null;
  progress: number;
  keyPoints: string[];
  pendingThreads: string[];
  tone: string;
  loading: boolean;
  error: string | null;
}

function mapPayload(payload: GameStatePayload): Omit<GameState, 'loading' | 'error'> {
  return {
    sessionId: payload.sessionId,
    theme: payload.theme,
    length: payload.length as StoryLength,
    gender: (payload.gender as 'male' | 'female') || 'male',
    turn: payload.turn,
    maxTurns: payload.maxTurns,
    status: payload.status as Status,
    storyLog: payload.storyLog,
    latest: payload.latest,
    progress: payload.progress ?? 0,
    keyPoints: payload.keyPoints ?? [],
    pendingThreads: payload.pendingThreads ?? [],
    tone: payload.tone ?? '',
  };
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    sessionId: '',
    theme: 'wuxia',
    length: 'short',
    gender: 'male',
    turn: 0,
    maxTurns: 0,
    status: 'idle',
    storyLog: [] as StoryLogEntry[],
    latest: null,
    progress: 0,
    keyPoints: [],
    pendingThreads: [],
    tone: '',
    loading: false,
    error: null,
  }),
  getters: {
    isReady(state): boolean {
      return Boolean(state.sessionId);
    },
    isActive(state): boolean {
      return state.status === 'in-progress';
    },
    isComplete(state): boolean {
      return state.status === 'completed';
    },
    progressLabel(state): number {
      return Math.max(0, Math.min(100, Math.round(state.progress)));
    },
  },
  actions: {
    async startNewGame(payload: StartGameRequest) {
      this.loading = true;
      this.error = null;
      try {
        const result = await startGame(payload);
        this.assignPayload(result);
      } catch (err) {
        this.captureError(err);
      } finally {
        this.loading = false;
      }
    },
    async submitInput(userInput: string) {
      if (!this.sessionId || this.loading) {
        return;
      }

      this.loading = true;
      this.error = null;
      try {
        const result = await submitTurn({ sessionId: this.sessionId, userInput });
        this.assignPayload(result);
      } catch (err) {
        this.captureError(err);
      } finally {
        this.loading = false;
      }
    },
    async refreshState() {
      if (!this.sessionId) {
        return;
      }

      this.loading = true;
      this.error = null;
      try {
        const result = await fetchState(this.sessionId);
        this.assignPayload(result);
      } catch (err) {
        this.captureError(err);
      } finally {
        this.loading = false;
      }
    },
    resetGame() {
      this.sessionId = '';
      this.turn = 0;
      this.maxTurns = 0;
      this.storyLog = [];
      this.latest = null;
      this.status = 'idle';
      this.progress = 0;
      this.keyPoints = [];
      this.pendingThreads = [];
      this.tone = '';
      this.gender = 'male';
      this.error = null;
    },
    assignPayload(payload: GameStatePayload) {
      const mapped = mapPayload(payload);
      this.sessionId = mapped.sessionId;
      this.theme = mapped.theme;
      this.length = mapped.length;
      this.gender = mapped.gender;
      this.turn = mapped.turn;
      this.maxTurns = mapped.maxTurns;
      this.status = mapped.status;
      this.storyLog = mapped.storyLog;
      this.latest = mapped.latest;
      this.progress = mapped.progress;
      this.keyPoints = mapped.keyPoints;
      this.pendingThreads = mapped.pendingThreads;
      this.tone = mapped.tone;
    },
    captureError(err: unknown) {
      if (err instanceof Error) {
        this.error = err.message;
      } else if (typeof err === 'string') {
        this.error = err;
      } else {
        this.error = '發生未知錯誤，請稍後再試。';
      }
    },
  },
});
