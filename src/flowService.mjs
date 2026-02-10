export const FlowState = {
  SPECTRUM: "SPECTRUM",
  IMPULSE: "IMPULSE",
  RESULT: "RESULT",
  SILENCE: "SILENCE",
};

const RunStatus = { IN_PROGRESS: "IN_PROGRESS", COMPLETED: "COMPLETED" };

const users = {
  u1: { id: "u1", displayName: "Mila", email: "mila@example.com", tz: "Europe/Bratislava" },
  u2: { id: "u2", displayName: "Niko", email: "niko@example.com", tz: "Europe/Bratislava" },
};
const friendships = new Set(["u1::u2"]);
const friendRequests = [];
const runsByUserDate = new Map();
const runsById = new Map();
let runCounter = 0;
let requestCounter = 0;

const redirectFor = (state) =>
  state === FlowState.SPECTRUM
    ? "/flow/spectrum"
    : state === FlowState.IMPULSE
      ? "/flow/impulse"
      : state === FlowState.RESULT
        ? "/flow/result"
        : "/silence";

const nextState = (state) =>
  state === FlowState.SPECTRUM
    ? FlowState.IMPULSE
    : state === FlowState.IMPULSE
      ? FlowState.RESULT
      : FlowState.SILENCE;

const createContent = () => ({
  spectrum: {
    lines: ["Dnešný priestor drží tichú vrstvu pozornosti.", "Vnútorný tón zostáva otvorený bez tlaku."],
    token: "soft-wave",
  },
  impulse: { prompt: "Jemný pohyb je prítomný aj bez pomenovania." },
  result: {
    lines: ["Dnešné naladenie pôsobí sústredene a pokojne.", "Prítomnosť zostáva stabilná v tichom tempe."],
  },
  silence: { line: "Ticho zostáva otvorené." },
});

const keyOf = (userId, date) => `${userId}:${date}`;

export function ensureRun(userId, date) {
  const key = keyOf(userId, date);
  if (runsByUserDate.has(key)) return runsByUserDate.get(key);
  runCounter += 1;
  const internal = {
    run: {
      id: `run-${runCounter}`,
      userId,
      date,
      status: RunStatus.IN_PROGRESS,
      currentState: FlowState.SPECTRUM,
      createdAt: new Date().toISOString(),
    },
    content: createContent(),
    shared: false,
  };
  runsByUserDate.set(key, internal);
  runsById.set(internal.run.id, internal);
  return internal;
}

export const getUser = (userId) => users[userId] ?? null;

export function startToday(userId, date) {
  const internal = ensureRun(userId, date);
  return {
    run: internal.run,
    redirectTo: internal.run.status === RunStatus.COMPLETED ? "/silence" : redirectFor(internal.run.currentState),
  };
}

export function guardState(userId, date, requested) {
  const internal = ensureRun(userId, date);
  if (internal.run.status === RunStatus.COMPLETED || requested === FlowState.SILENCE) {
    return { ok: true, redirectTo: "/silence", run: internal.run, content: internal.content };
  }
  if (requested !== internal.run.currentState) {
    return { ok: false, redirectTo: redirectFor(internal.run.currentState), run: internal.run, content: internal.content };
  }
  return { ok: true, redirectTo: redirectFor(internal.run.currentState), run: internal.run, content: internal.content };
}

export function advanceState(userId, date, payload = {}) {
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
    internal.run.completedAt = new Date().toISOString();
  }
  return { run: internal.run, content: internal.content, redirectTo: redirectFor(internal.run.currentState) };
}

export const getHistory = (userId) => ({
  days: [...runsByUserDate.values()]
    .filter((x) => x.run.userId === userId)
    .map((x) => ({ date: x.run.date, status: x.run.status, shared: x.shared, moodToken: x.content.spectrum.token })),
});

export const getDay = (userId, date) => {
  const internal = runsByUserDate.get(keyOf(userId, date));
  if (!internal) return null;
  return { run: internal.run, content: internal.content, share: { runId: internal.run.id, isEnabled: internal.shared } };
};

export const setShare = (userId, runId, isEnabled) => {
  const internal = runsById.get(runId);
  if (!internal || internal.run.userId !== userId) return null;
  internal.shared = Boolean(isEnabled);
  return { share: { runId, isEnabled: Boolean(isEnabled), enabledAt: isEnabled ? new Date().toISOString() : undefined } };
};

export const getSharePublic = (runId) => {
  const internal = runsById.get(runId);
  if (!internal || !internal.shared) return null;
  return { date: internal.run.date, displayName: users[internal.run.userId].displayName, resultLines: internal.content.result.lines };
};

export const listFriends = (userId) => ({
  friends: [...friendships]
    .map((x) => x.split("::"))
    .filter(([a, b]) => a === userId || b === userId)
    .map(([a, b]) => (a === userId ? b : a))
    .map((id) => ({ id, displayName: users[id].displayName })),
});

export const getFeed = (userId) => {
  const ids = new Set(listFriends(userId).friends.map((x) => x.id));
  return {
    traces: [...runsByUserDate.values()]
      .filter((x) => ids.has(x.run.userId) && x.run.status === RunStatus.COMPLETED)
      .map((x) => ({
        id: `${x.run.id}-trace`,
        userId: x.run.userId,
        date: x.run.date,
        presence: true,
        moodToken: x.content.spectrum.token,
        sharedRunId: x.shared ? x.run.id : undefined,
      })),
  };
};

export const sendFriendRequest = (fromUserId, toEmail) => {
  const toUser = Object.values(users).find((u) => u.email === toEmail);
  if (!toUser) return null;
  requestCounter += 1;
  const request = { id: `fr-${requestCounter}`, fromUserId, toUserId: toUser.id, createdAt: new Date().toISOString() };
  friendRequests.push(request);
  return request;
};

export const listFriendRequests = (userId) => ({
  incoming: friendRequests.filter((r) => r.toUserId === userId),
  outgoing: friendRequests.filter((r) => r.fromUserId === userId),
});

export const acceptFriendRequest = (userId, requestId) => {
  const index = friendRequests.findIndex((r) => r.id === requestId && r.toUserId === userId);
  if (index < 0) return false;
  const request = friendRequests[index];
  friendships.add([request.fromUserId, request.toUserId].sort().join("::"));
  friendRequests.splice(index, 1);
  return true;
};

export const resetData = () => {
  runsByUserDate.clear();
  runsById.clear();
  friendRequests.length = 0;
  runCounter = 0;
  requestCounter = 0;
};
