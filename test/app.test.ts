import request from "supertest";
import { describe, expect, it, beforeEach } from "vitest";
import { createApp } from "../src/app.js";
import { resetData } from "../src/flowService.js";
import { validateCoreCopy } from "../src/copyValidator.js";

const auth = { "x-user-id": "u1" };
const friendAuth = { "x-user-id": "u2" };

describe("soc.stat flow", () => {
  beforeEach(() => {
    resetData();
  });

  it("AC1: direct URL skip is redirected to current state", async () => {
    const app = createApp();
    await request(app).get("/today").set(auth).expect(200);
    const response = await request(app).get("/flow/result").set(auth).expect(302);
    expect(response.header.location).toBe("/flow/spectrum");
  });

  it("AC2: SILENCE page has no CTA controls", async () => {
    const app = createApp();
    await request(app).get("/today").set(auth).expect(200);
    await request(app).post("/flow/advance").set(auth).send({}).expect(200);
    await request(app).post("/flow/advance").set(auth).send({}).expect(200);
    await request(app).post("/flow/advance").set(auth).send({}).expect(200);

    const silence = await request(app).get("/silence").set(auth).expect(200);
    expect(silence.text).not.toContain("Ďalej");
    expect(silence.text).not.toContain("Preskočiť");
    expect(silence.text).not.toContain("Dokončiť");
  });

  it("AC3: impulse response is optional and result is still generated", async () => {
    const app = createApp();
    await request(app).get("/today").set(auth).expect(200);
    await request(app).post("/flow/advance").set(auth).send({}).expect(200);
    await request(app).post("/flow/advance").set(auth).send({ impulse: {} }).expect(200);

    const result = await request(app).get("/flow/result").set(auth).expect(200);
    expect(result.text).toContain("RESULT");
  });

  it("AC4 + AC5: feed does not expose private text; public share is read-only and anonymous access", async () => {
    const app = createApp();

    await request(app).get("/today").set(friendAuth).expect(200);
    await request(app).post("/flow/advance").set(friendAuth).send({}).expect(200);
    await request(app)
      .post("/flow/advance")
      .set(friendAuth)
      .send({ impulse: { responseText: "Súkromná veta" } })
      .expect(200);
    const completion = await request(app).post("/flow/advance").set(friendAuth).send({}).expect(200);
    const runId = completion.body.run.id as string;

    const feedPrivate = await request(app).get("/feed").set(auth).expect(200);
    expect(JSON.stringify(feedPrivate.body)).not.toContain("Súkromná veta");
    expect(feedPrivate.body.traces[0].sharedRunId).toBeUndefined();

    await request(app).post(`/share/${runId}`).set(friendAuth).send({ isEnabled: true }).expect(200);

    const shared = await request(app).get(`/share/${runId}`).expect(200);
    expect(shared.text).toContain("Share");

    await request(app).post(`/share/${runId}`).send({ isEnabled: false }).expect(401);
  });

  it("copy validator rejects forbidden patterns", () => {
    const result = validateCoreCopy("Pokračuj zajtra?");
    expect(result.ok).toBe(false);
    expect(result.violations.map((v) => v.code)).toEqual(
      expect.arrayContaining(["HAS_QUESTION_MARK", "HAS_CTA", "HAS_FUTURE_PROJECTION"]),
    );
  });
});
