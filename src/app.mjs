import { createServer } from "node:http";
import { FlowState, acceptFriendRequest, advanceState, getDay, getFeed, getHistory, getSharePublic, getUser, guardState, listFriendRequests, listFriends, sendFriendRequest, setShare, startToday } from "./flowService.mjs";

const todayDate = () => new Date().toISOString().slice(0, 10);

const readBody = (req) =>
  new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({});
      }
    });
  });

const sendJson = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
};

const sendHtml = (res, status, title, lines = [], controls = []) => {
  const body = `<!doctype html><html><body><main><h1>${title}</h1>${lines.map((x) => `<p>${x}</p>`).join("")}<nav>${controls.map((x) => `<span>${x}</span>`).join(" ")}</nav></main></body></html>`;
  res.writeHead(status, { "content-type": "text/html; charset=utf-8" });
  res.end(body);
};

const authUserId = (req) => {
  const userId = req.headers["x-user-id"];
  return typeof userId === "string" && getUser(userId) ? userId : null;
};

export function createAppServer() {
  return createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    const { pathname } = url;

    if (pathname === "/") return sendHtml(res, 200, "soc.stat", ["Priestor pre denný tichý stav."], ["Vstúpiť"]);
    if (pathname === "/login") return sendHtml(res, 200, "Prihlásenie");
    if (pathname === "/register") return sendHtml(res, 200, "Registrácia");
    if (pathname.startsWith("/share/") && req.method === "GET") {
      const runId = pathname.split("/")[2];
      const share = getSharePublic(runId);
      if (!share) return sendJson(res, 404, { error: "Not found" });
      return sendHtml(res, 200, `Share ${share.date}`, share.resultLines);
    }

    const userId = authUserId(req);
    if (!userId) return sendJson(res, 401, { error: "Unauthorized" });

    if (pathname === "/today" && req.method === "GET") return sendJson(res, 200, startToday(userId, todayDate()));

    if (pathname === "/flow/spectrum" && req.method === "GET") {
      const g = guardState(userId, todayDate(), FlowState.SPECTRUM);
      if (!g.ok) {
        res.writeHead(302, { Location: g.redirectTo });
        return res.end();
      }
      return sendHtml(res, 200, "SPECTRUM", g.content.spectrum.lines, ["Ďalej"]);
    }

    if (pathname === "/flow/impulse" && req.method === "GET") {
      const g = guardState(userId, todayDate(), FlowState.IMPULSE);
      if (!g.ok) {
        res.writeHead(302, { Location: g.redirectTo });
        return res.end();
      }
      return sendHtml(res, 200, "IMPULSE", [g.content.impulse.prompt], ["Preskočiť", "Ďalej"]);
    }

    if (pathname === "/flow/result" && req.method === "GET") {
      const g = guardState(userId, todayDate(), FlowState.RESULT);
      if (!g.ok) {
        res.writeHead(302, { Location: g.redirectTo });
        return res.end();
      }
      return sendHtml(res, 200, "RESULT", g.content.result.lines, ["Dokončiť"]);
    }

    if (pathname === "/silence" && req.method === "GET") {
      const g = guardState(userId, todayDate(), FlowState.SILENCE);
      return sendHtml(res, 200, "SILENCE", [g.content.silence.line]);
    }

    if (pathname === "/flow/advance" && req.method === "POST") {
      const body = await readBody(req);
      return sendJson(
        res,
        200,
        advanceState(userId, todayDate(), {
          responseText: body?.impulse?.responseText,
          reactionToken: body?.impulse?.reactionToken,
          noteText: body?.resultNote?.noteText,
        }),
      );
    }

    if (pathname === "/history" && req.method === "GET") return sendJson(res, 200, getHistory(userId));
    if (pathname.startsWith("/day/") && req.method === "GET") {
      const day = getDay(userId, pathname.split("/")[2]);
      return day ? sendJson(res, 200, day) : sendJson(res, 404, { error: "Not found" });
    }
    if (pathname === "/friends" && req.method === "GET") return sendJson(res, 200, listFriends(userId));
    if (pathname === "/friends/requests" && req.method === "GET") return sendJson(res, 200, listFriendRequests(userId));
    if (pathname === "/friends/requests" && req.method === "POST") {
      const body = await readBody(req);
      const created = sendFriendRequest(userId, body?.toEmail ?? "");
      return created ? sendJson(res, 201, created) : sendJson(res, 400, { error: "Unknown target" });
    }
    if (pathname.startsWith("/friends/requests/") && pathname.endsWith("/accept") && req.method === "POST") {
      const requestId = pathname.split("/")[3];
      return acceptFriendRequest(userId, requestId) ? sendJson(res, 204, {}) : sendJson(res, 404, { error: "Request not found" });
    }
    if (pathname === "/feed" && req.method === "GET") return sendJson(res, 200, getFeed(userId));
    if (pathname.startsWith("/share/") && req.method === "POST") {
      const runId = pathname.split("/")[2];
      const body = await readBody(req);
      const response = setShare(userId, runId, Boolean(body?.isEnabled));
      return response ? sendJson(res, 200, response) : sendJson(res, 404, { error: "Not found" });
    }
    if (pathname === "/settings") return sendHtml(res, 200, "Nastavenia");

    return sendJson(res, 404, { error: "Not found" });
  });
}
