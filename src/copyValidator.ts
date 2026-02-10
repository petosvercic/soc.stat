import type { ValidateCopyResult } from "../SPEC_CONTRACTS.js";

const CTA_PATTERNS = ["pokračuj", "klikni", "zdieľaj", "pozvi", "odmeň", "získaj"];
const FUTURE_PATTERNS = ["zajtra", "budúci týždeň", "o chvíľu"];
const JUDGEMENT_PATTERNS = ["správne", "nesprávne", "lepšie", "horšie"];

export function validateCoreCopy(text: string): ValidateCopyResult {
  const source = text.toLowerCase();
  const violations: ValidateCopyResult["violations"] = [];

  if (source.includes("?")) {
    violations.push({ code: "HAS_QUESTION_MARK", sample: "?" });
  }

  const cta = CTA_PATTERNS.find((pattern) => source.includes(pattern));
  if (cta) {
    violations.push({ code: "HAS_CTA", sample: cta });
  }

  const future = FUTURE_PATTERNS.find((pattern) => source.includes(pattern));
  if (future) {
    violations.push({ code: "HAS_FUTURE_PROJECTION", sample: future });
  }

  const judgement = JUDGEMENT_PATTERNS.find((pattern) => source.includes(pattern));
  if (judgement) {
    violations.push({ code: "HAS_JUDGEMENT", sample: judgement });
  }

  return {
    ok: violations.length === 0,
    violations,
  };
}
