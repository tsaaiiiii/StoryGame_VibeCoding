import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001",
});

export interface StoryDisplay {
  sceneTitle: string;
  background: string[];
  recap: string;
  interaction: string;
  progress: string;
}

export interface StoryUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
  input_tokens?: number;
  output_tokens?: number;
}

export interface StorySegment {
  narrative: string;
  options: string[];
  display?: StoryDisplay;
  playerAction?: string;
  progress?: number;
  keyPoints?: string[];
  pendingThreads?: string[];
  tone?: string;
  usage?: StoryUsage | null;
  memorySummary?: string;
  lastActionSummary?: string;
}

export interface StoryLogEntry {
  narrative: string;
  playerAction: string;
  progress?: number;
  keyPoints?: string[];
  pendingThreads?: string[];
  tone?: string;
  usage?: StoryUsage | null;
  memorySummary?: string;
  lastActionSummary?: string;
}

export interface GameStatePayload {
  sessionId: string;
  theme: string;
  length: string;
  gender: "male" | "female";
  turn: number;
  maxTurns: number;
  status: "in-progress" | "completed";
  storyLog: StoryLogEntry[];
  latest: StorySegment | null;
  progress: number;
  keyPoints: string[];
  pendingThreads: string[];
  tone: string;
}

export interface StartGameRequest {
  theme: string;
  length?: "short" | "medium" | "long";
  gender?: "male" | "female";
}

export interface NextTurnRequest {
  sessionId: string;
  userInput: string;
}

export async function startGame(payload: StartGameRequest) {
  const { data } = await api.post<GameStatePayload>("/api/start", payload);
  return data;
}

export async function submitTurn(payload: NextTurnRequest) {
  const { data } = await api.post<GameStatePayload>("/api/next", payload);
  return data;
}

export async function fetchState(sessionId: string) {
  const { data } = await api.get<GameStatePayload>(`/api/state/${sessionId}`);
  return data;
}
