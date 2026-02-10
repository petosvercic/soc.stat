import { FlowState, RunStatus, type DailyRun, type ISODate, type RunContent } from "../SPEC_CONTRACTS.js";

type AppUser = { id: string; displayName: string; email: string; tz: string };

type InternalRun = {
  run: DailyRun;
  content: RunContent;
  shared: boolean;
};

type FriendRequest = { id: string; fromUserId: string; toUserId: string; createdAt: string };

const users: Record<string, AppUser> = {
  u1: { id: "u1", displayName: "Mila", email: "mila@example.com", tz: "Europe/Bratislava" },
  u2: { id: "u2", displayName: "Niko", email: "niko@example.com", tz: "Europe/Bratislava" },
};

const friendships = new Set<string>([pairKey("u1", "u2")]);
const friendRequests: FriendRequest[] = [];
const runsByUserDate = new Map<string, InternalRun>();
const runsById = new Map<string, InternalRun>();

let runCounter = 0;
let requestCounter = 0;

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("::");
}

function nowIso(): string {
  return new Date().toISOString();
}

function keyOf(userId: string, date: ISODate): string {
  return `${userId}:${date}`;
}

function nextState(current: FlowState): FlowState {
  if (current === FlowState.SPECTRUM) return FlowState.IMPULSE;
  if (current === FlowState.IMPULSE) return FlowState.RESULT;
  return FlowState.SILENCE;
}

function redirectFor(state: FlowState): "/flow/spectrum" | "/flow/impulse" | "/flow/result" | "/silence" {
  if (state === FlowState.SPECTRUM) return "/flow/spectrum";
  if (state === FlowState.IMPULSE) return "/flow/impulse";
  if (state === FlowState.RESULT) return "/flow/result";
  return "/silence";
}

function createContent(): RunContent {
  return {
    spectrum: {
      lines: [
        "Dnešný priestor drží tichú vrstvu pozornosti.",
        "Vnútorný tón zostáva otvorený bez tlaku.",
      ],
      token: "soft-wave",
    },
    impulse: {
      prompt: "Jemný pohyb je prítomný aj bez pomenovania.",
    },
    result: {
      lines: [
        "Dnešné naladenie pôsobí sústredene a pokojne.",
        "Prítomnosť zostáva stabilná v tichom tempe.",
      ],
    },
    silence: {
      line: "Ticho zostáva otvorené.",
    },
  };
}

export function ensureRun(userId: string, date: ISODate): InternalRun {
  const key = keyOf(userId, date);
  const existing = runsByUserDate.get(key);
  if (existing) return existing;

  runCounter += 1;
  const id = `run-${runCounter}`;
  const run: DailyRun = {
    id,
    userId,
    date,
    status: RunStatus.IN_PROGRESS,
    currentState: FlowState.SPECTRUM,
    createdAt: nowIso(),
  };

  const internal: InternalRun = {
    run,
    content: createContent(),
    shared: false,
  };
  runsByUserDate.set(key, internal);
  runsById.set(id, internal);
  return internal;
}

export function startToday(userId: string, date: ISODate) {
  const internal = ensureRun(userId, date);
  return {
    run: internal.run,
    redirectTo: internal.run.status === RunStatus.COMPLETED ? "/silence" : redirectFor(internal.run.currentState),
  };
}

export function guardState(userId: string, date: ISODate, requested: FlowState) {
  const internal = ensureRun(userId, date);
  const active = internal.run.currentState;
  if (internal.run.status === RunStatus.COMPLETED || requested === FlowState.SILENCE) {
    return { ok: true, redirectTo: "/silence" as const, run: internal.run, content: internal.content };
  }
  if (active !== requested) {
    return { ok: false, redirectTo: redirectFor(active), run: internal.run, content: internal.content };
  }
  return { ok: true, redirectTo: redirectFor(active), run: internal.run, content: internal.content };
}

export function advanceState(
  userId: string,
  date: ISODate,
  payload: { responseText?: string; reactionToken?: "A" | "B" | "C"; noteText?: string },
) {
  const internal = ensureRun(userId, date);
  if (internal.run.currentState === FlowState.IMPULSE) {
    internal.content.impulse.responseText = payload.responseText?.slice(0, 240);
    internal.content.impulse.reactionToken = payload.reactionToken;
  }

  if (internal.run.currentState === FlowState.RESULT && payload.noteText) {
    internal.content.result.noteText = payload.noteText.slice(0, 240);
  }

  internal.run.currentState = nextState(internal.run.currentState);
  if (internal.run.currentState === FlowState.SILENCE) {
    internal.run.status = RunStatus.COMPLETED;
    internal.run.completedAt = nowIso();
  }

  return {
    run: internal.run,
    content: internal.content,
    redirectTo: redirectFor(internal.run.currentState),
  };
}

export function getHistory(userId: string) {
  const days = Array.from(runsByUserDate.values())
    .filter((internal) => internal.run.userId === userId)
    .map((internal) => ({
      date: internal.run.date,
      status: internal.run.status,
      shared: internal.shared,
      moodToken: internal.content.spectrum.token,
    }));
  return { days };
}

export function getDay(userId: string, date: ISODate) {
  const internal = runsByUserDate.get(keyOf(userId, date));
  if (!internal) return null;
  return {
    run: internal.run,
    content: internal.content,
    share: {
      runId: internal.run.id,
      isEnabled: internal.shared,
    },
  };
}

export function setShare(userId: string, runId: string, isEnabled: boolean) {
  const internal = runsById.get(runId);
  if (!internal || internal.run.userId !== userId) return null;
  internal.shared = isEnabled;
  return {
    share: {
      runId,
      isEnabled,
      enabledAt: isEnabled ? nowIso() : undefined,
    },
  };
}

export function getSharePublic(runId: string) {
  const internal = runsById.get(runId);
  if (!internal || !internal.shared) return null;
  return {
    date: internal.run.date,
    displayName: users[internal.run.userId]?.displayName ?? "Unknown",
    resultLines: internal.content.result.lines,
  };
}

export function sendFriendRequest(fromUserId: string, toEmail: string) {
  const target = Object.values(users).find((user) => user.email === toEmail);
  if (!target) return null;
  requestCounter += 1;
  const request = { id: `fr-${requestCounter}`, fromUserId, toUserId: target.id, createdAt: nowIso() };
  friendRequests.push(request);
  return request;
}

export function listFriendRequests(userId: string) {
  return {
    incoming: friendRequests.filter((request) => request.toUserId === userId),
    outgoing: friendRequests.filter((request) => request.fromUserId === userId),
  };
}

export function acceptFriendRequest(userId: string, requestId: string) {
  const index = friendRequests.findIndex((request) => request.id === requestId && request.toUserId === userId);
  if (index < 0) return false;
  const request = friendRequests[index];
  friendships.add(pairKey(request.fromUserId, request.toUserId));
  friendRequests.splice(index, 1);
  return true;
}

export function listFriends(userId: string) {
  const friends = Array.from(friendships)
    .map((key) => key.split("::"))
    .filter(([a, b]) => a === userId || b === userId)
    .map(([a, b]) => (a === userId ? b : a))
    .map((id) => ({ id, displayName: users[id]?.displayName ?? id }));
  return { friends };
}

export function getFeed(userId: string) {
  const friendIds = new Set(listFriends(userId).friends.map((friend) => friend.id));
  const traces = Array.from(runsByUserDate.values())
    .filter((internal) => friendIds.has(internal.run.userId) && internal.run.status === RunStatus.COMPLETED)
    .map((internal) => ({
      id: `${internal.run.id}-trace`,
      userId: internal.run.userId,
      date: internal.run.date,
      presence: true as const,
      moodToken: internal.content.spectrum.token,
      sharedRunId: internal.shared ? internal.run.id : undefined,
    }));
  return { traces };
}

export function getUser(userId: string) {
  return users[userId] ?? null;
}

export function resetData() {
  runsByUserDate.clear();
  runsById.clear();
  friendRequests.length = 0;
  runCounter = 0;
  requestCounter = 0;
}
