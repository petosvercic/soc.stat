import express from "express";
import { FlowState, type ISODate } from "../SPEC_CONTRACTS.js";
import {
  acceptFriendRequest,
  advanceState,
  getDay,
  getFeed,
  getHistory,
  getSharePublic,
  getUser,
  guardState,
  listFriendRequests,
  listFriends,
  sendFriendRequest,
  setShare,
  startToday,
} from "./flowService.js";

function todayDate(): ISODate {
  return new Date().toISOString().slice(0, 10) as ISODate;
}

function getUserId(req: express.Request): string | null {
  return (req.header("x-user-id") ?? req.query.userId)?.toString() ?? null;
}

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const userId = getUserId(req);
  if (!userId || !getUser(userId)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.locals.userId = userId;
  return next();
}

function statePage(title: string, lines: string[], controls: string[]) {
  return `<!doctype html><html><body><main><h1>${title}</h1>${lines.map((line) => `<p>${line}</p>`).join("")}<nav>${controls.map((c) => `<span>${c}</span>`).join(" ")}</nav></main></body></html>`;
}

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/", (_req, res) => res.send(statePage("soc.stat", ["Priestor pre denný tichý stav."], ["Vstúpiť"])));
  app.get("/login", (_req, res) => res.send("Prihlásenie"));
  app.get("/register", (_req, res) => res.send("Registrácia"));

  app.get("/today", requireAuth, (req, res) => {
    const response = startToday(res.locals.userId, todayDate());
    res.json(response);
  });

  app.get("/flow/spectrum", requireAuth, (_req, res) => {
    const g = guardState(res.locals.userId, todayDate(), FlowState.SPECTRUM);
    if (!g.ok) return res.redirect(g.redirectTo);
    return res.send(statePage("SPECTRUM", g.content.spectrum.lines, ["Ďalej"]));
  });

  app.get("/flow/impulse", requireAuth, (_req, res) => {
    const g = guardState(res.locals.userId, todayDate(), FlowState.IMPULSE);
    if (!g.ok) return res.redirect(g.redirectTo);
    return res.send(statePage("IMPULSE", [g.content.impulse.prompt], ["Preskočiť", "Ďalej"]));
  });

  app.get("/flow/result", requireAuth, (_req, res) => {
    const g = guardState(res.locals.userId, todayDate(), FlowState.RESULT);
    if (!g.ok) return res.redirect(g.redirectTo);
    return res.send(statePage("RESULT", g.content.result.lines, ["Dokončiť"]));
  });

  app.get("/silence", requireAuth, (_req, res) => {
    const g = guardState(res.locals.userId, todayDate(), FlowState.SILENCE);
    return res.send(statePage("SILENCE", [g.content.silence.line ?? "Ticho."], []));
  });

  app.post("/flow/advance", requireAuth, (req, res) => {
    const response = advanceState(res.locals.userId, todayDate(), {
      responseText: req.body?.impulse?.responseText,
      reactionToken: req.body?.impulse?.reactionToken,
      noteText: req.body?.resultNote?.noteText,
    });
    res.json(response);
  });

  app.get("/history", requireAuth, (_req, res) => res.json(getHistory(res.locals.userId)));

  app.get("/day/:date", requireAuth, (req, res) => {
    const day = getDay(res.locals.userId, req.params.date as ISODate);
    if (!day) return res.status(404).json({ error: "Not found" });
    return res.json(day);
  });

  app.get("/friends", requireAuth, (_req, res) => res.json(listFriends(res.locals.userId)));
  app.get("/friends/requests", requireAuth, (_req, res) => res.json(listFriendRequests(res.locals.userId)));
  app.post("/friends/requests", requireAuth, (req, res) => {
    const request = sendFriendRequest(res.locals.userId, req.body?.toEmail ?? "");
    if (!request) return res.status(400).json({ error: "Unknown target" });
    return res.status(201).json(request);
  });
  app.post("/friends/requests/:requestId/accept", requireAuth, (req, res) => {
    const ok = acceptFriendRequest(res.locals.userId, req.params.requestId);
    if (!ok) return res.status(404).json({ error: "Request not found" });
    return res.status(204).send();
  });

  app.get("/feed", requireAuth, (_req, res) => res.json(getFeed(res.locals.userId)));

  app.get("/share/:runId", (req, res) => {
    const share = getSharePublic(req.params.runId);
    if (!share) return res.status(404).json({ error: "Not found" });
    return res.send(statePage(`Share ${share.date}`, share.resultLines, []));
  });

  app.post("/share/:runId", requireAuth, (req, res) => {
    const response = setShare(res.locals.userId, req.params.runId, Boolean(req.body?.isEnabled));
    if (!response) return res.status(404).json({ error: "Not found" });
    return res.json(response);
  });

  app.get("/settings", requireAuth, (_req, res) => res.send("Nastavenia"));

  return app;
}
