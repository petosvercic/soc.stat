// SPEC_CONTRACTS.ts

export type ISODate = `${number}-${number}-${number}`; // YYYY-MM-DD
export type ISODateTime = string; // ISO 8601

export enum FlowState {
  SPECTRUM = "SPECTRUM",
  IMPULSE = "IMPULSE",
  RESULT = "RESULT",
  SILENCE = "SILENCE",
}

export enum RunStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  tz: string; // IANA timezone
  createdAt: ISODateTime;
}

export interface DailyRun {
  id: string;
  userId: string;
  date: ISODate; // local date for user
  status: RunStatus;
  currentState: FlowState;
  createdAt: ISODateTime;
  completedAt?: ISODateTime;
}

export interface SpectrumPayload {
  // generované alebo vybrané z knižnice
  lines: string[]; // 1–3 vety
  token?: string; // voliteľný mood token
}

export interface ImpulsePayload {
  prompt: string; // podnet, nie otázka
  // voliteľná reakcia používateľa
  responseText?: string; // max 240
  reactionToken?: "A" | "B" | "C"; // voliteľné tiché reakcie
}

export interface ResultPayload {
  lines: string[]; // 1–4 vety
  noteText?: string; // voliteľná poznámka max 240
}

export interface SilencePayload {
  line?: string; // max 1 veta, bez CTA
}

export interface RunContent {
  spectrum: SpectrumPayload;
  impulse: ImpulsePayload;
  result: ResultPayload;
  silence: SilencePayload;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  createdAt: ISODateTime;
}

export interface Friendship {
  id: string;
  userAId: string;
  userBId: string;
  createdAt: ISODateTime;
}

export interface SocialTrace {
  // to, čo je povolené ukazovať v feede
  id: string;
  userId: string;
  date: ISODate;
  presence: true;
  moodToken?: string;
  sharedRunId?: string; // ak existuje share
}

export interface Share {
  runId: string;
  isEnabled: boolean;
  enabledAt?: ISODateTime;
}

// -------- API Contracts --------

// Auth (placeholder)
export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  tz: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}

// Flow
export interface StartTodayResponse {
  run: DailyRun;
  redirectTo: "/flow/spectrum" | "/flow/impulse" | "/flow/result" | "/silence";
}

export interface GetCurrentRunResponse {
  run: DailyRun;
  content?: Partial<RunContent>; // čo už existuje
}

export interface AdvanceStateRequest {
  runId: string;
  // payload podľa aktuálneho stavu
  spectrumAck?: true;
  impulse?: { responseText?: string; reactionToken?: "A" | "B" | "C" };
  resultNote?: { noteText?: string };
}

export interface AdvanceStateResponse {
  run: DailyRun;
  content: Partial<RunContent>;
  redirectTo: "/flow/spectrum" | "/flow/impulse" | "/flow/result" | "/silence";
}

// History
export interface ListHistoryResponse {
  days: Array<{ date: ISODate; status: RunStatus; shared: boolean; moodToken?: string }>;
}

export interface GetDayResponse {
  run: DailyRun;
  content: RunContent;
  share: Share;
}

// Friends
export interface SendFriendRequestRequest {
  toEmail: string;
}
export interface ListFriendRequestsResponse {
  incoming: FriendRequest[];
  outgoing: FriendRequest[];
}
export interface AcceptFriendRequestRequest {
  requestId: string;
}
export interface ListFriendsResponse {
  friends: Array<{ id: string; displayName: string }>;
}

// Feed
export interface GetFeedResponse {
  traces: SocialTrace[];
}

// Share
export interface SetShareRequest {
  runId: string;
  isEnabled: boolean;
}
export interface SetShareResponse {
  share: Share;
}

export interface GetSharePublicResponse {
  date: ISODate;
  displayName: string;
  resultLines: string[];
}

// -------- Validation helpers (contracts, not implementation) --------

export type CopyViolation = {
  code:
    | "HAS_QUESTION_MARK"
    | "HAS_CTA"
    | "HAS_FUTURE_PROJECTION"
    | "HAS_JUDGEMENT";
  sample: string;
};

export interface ValidateCopyResult {
  ok: boolean;
  violations: CopyViolation[];
}
