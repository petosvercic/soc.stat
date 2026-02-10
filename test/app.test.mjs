import test from "node:test";
import assert from "node:assert/strict";
import { createAppServer } from "../src/app.mjs";
import { resetData } from "../src/flowService.mjs";

async function withServer(run, configOverride = {}) {
  resetData();
  const server = createAppServer({
    nodeEnv: "test",
    port: 0,
    appApiToken: "",
    paywallToken: "",
    paywallProviderUrl: "",
    paywallPublicKey: "",
    vercelToken: "",
    repoSyncToken: "",
    ...configOverride,
  });
  await new Promise((resolve) => server.listen(0, resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  try {
    await run(baseUrl);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

const auth = { "x-user-id": "u1" };
const friendAuth = { "x-user-id": "u2" };

test("AC1: direct URL skip is redirected to current state", async () => {
  await withServer(async (baseUrl) => {
    await fetch(`${baseUrl}/today`, { headers: auth });
    const response = await fetch(`${baseUrl}/flow/result`, { headers: auth, redirect: "manual" });
    assert.equal(response.status, 302);
    assert.equal(response.headers.get("location"), "/flow/spectrum");
  });
});

test("AC2: SILENCE page has no CTA controls", async () => {
  await withServer(async (baseUrl) => {
    await fetch(`${baseUrl}/today`, { headers: auth });
    await fetch(`${baseUrl}/flow/advance`, { method: "POST", headers: { ...auth, "content-type": "application/json" }, body: "{}" });
    await fetch(`${baseUrl}/flow/advance`, { method: "POST", headers: { ...auth, "content-type": "application/json" }, body: "{}" });
    await fetch(`${baseUrl}/flow/advance`, { method: "POST", headers: { ...auth, "content-type": "application/json" }, body: "{}" });

    const silence = await fetch(`${baseUrl}/silence`, { headers: auth });
    const text = await silence.text();
    assert.equal(silence.status, 200);
    assert.ok(!text.includes("Ďalej"));
    assert.ok(!text.includes("Preskočiť"));
    assert.ok(!text.includes("Dokončiť"));
  });
});

test("AC3: impulse response is optional and result is still generated", async () => {
  await withServer(async (baseUrl) => {
    await fetch(`${baseUrl}/today`, { headers: auth });
    await fetch(`${baseUrl}/flow/advance`, { method: "POST", headers: { ...auth, "content-type": "application/json" }, body: "{}" });
    await fetch(`${baseUrl}/flow/advance`, {
      method: "POST",
      headers: { ...auth, "content-type": "application/json" },
      body: JSON.stringify({ impulse: {} }),
    });

    const result = await fetch(`${baseUrl}/flow/result`, { headers: auth });
    const html = await result.text();
    assert.equal(result.status, 200);
    assert.ok(html.includes("RESULT"));
  });
});

test("AC4 and AC5: feed is private-safe and share is read-only public", async () => {
  await withServer(async (baseUrl) => {
    await fetch(`${baseUrl}/today`, { headers: friendAuth });
    await fetch(`${baseUrl}/flow/advance`, { method: "POST", headers: { ...friendAuth, "content-type": "application/json" }, body: "{}" });
    await fetch(`${baseUrl}/flow/advance`, {
      method: "POST",
      headers: { ...friendAuth, "content-type": "application/json" },
      body: JSON.stringify({ impulse: { responseText: "Súkromná veta" } }),
    });
    const completionRes = await fetch(`${baseUrl}/flow/advance`, {
      method: "POST",
      headers: { ...friendAuth, "content-type": "application/json" },
      body: "{}",
    });
    const completion = await completionRes.json();
    const runId = completion.run.id;

    const feedPrivate = await fetch(`${baseUrl}/feed`, { headers: auth });
    const feedPrivateData = await feedPrivate.json();
    assert.equal(feedPrivate.status, 200);
    assert.ok(!JSON.stringify(feedPrivateData).includes("Súkromná veta"));
    assert.equal(feedPrivateData.traces[0].sharedRunId, undefined);

    await fetch(`${baseUrl}/share/${runId}`, {
      method: "POST",
      headers: { ...friendAuth, "content-type": "application/json" },
      body: JSON.stringify({ isEnabled: true }),
    });

    const sharePublic = await fetch(`${baseUrl}/share/${runId}`);
    assert.equal(sharePublic.status, 200);

    const shareWriteAttempt = await fetch(`${baseUrl}/share/${runId}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isEnabled: false }),
    });
    assert.equal(shareWriteAttempt.status, 401);
  });
});

test("protected routes require app token when configured", async () => {
  await withServer(
    async (baseUrl) => {
      const noToken = await fetch(`${baseUrl}/today`, { headers: auth });
      assert.equal(noToken.status, 401);

      const wrongToken = await fetch(`${baseUrl}/today`, { headers: { ...auth, "x-app-token": "wrong" } });
      assert.equal(wrongToken.status, 401);

      const okToken = await fetch(`${baseUrl}/today`, { headers: { ...auth, "x-app-token": "test-token" } });
      assert.equal(okToken.status, 200);
    },
    { appApiToken: "test-token" },
  );
});

test("paywall config requires paywall token", async () => {
  await withServer(
    async (baseUrl) => {
      const noToken = await fetch(`${baseUrl}/paywall/config`);
      assert.equal(noToken.status, 401);

      const okToken = await fetch(`${baseUrl}/paywall/config`, { headers: { "x-paywall-token": "pw" } });
      assert.equal(okToken.status, 200);
      const data = await okToken.json();
      assert.equal(data.providerUrl, "https://paywall.example.com");
    },
    { paywallToken: "pw", paywallProviderUrl: "https://paywall.example.com", paywallPublicKey: "pk_live" },
  );
});
