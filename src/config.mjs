import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  const eqIndex = trimmed.indexOf("=");
  if (eqIndex < 0) return null;
  const key = trimmed.slice(0, eqIndex).trim();
  let value = trimmed.slice(eqIndex + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  return { key, value };
}

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const raw = readFileSync(filePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const parsed = parseEnvLine(line);
    if (!parsed) continue;
    if (!process.env[parsed.key]) {
      process.env[parsed.key] = parsed.value;
    }
  }
}

export function initConfig(rootDir = process.cwd()) {
  loadEnvFile(path.join(rootDir, ".env.lokal"));
  loadEnvFile(path.join(rootDir, ".env.local"));

  const config = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? 3000),
    appApiToken: process.env.APP_API_TOKEN ?? "",
    paywallToken: process.env.PAYWALL_TOKEN ?? "",
    paywallProviderUrl: process.env.PAYWALL_PROVIDER_URL ?? "",
    paywallPublicKey: process.env.PAYWALL_PUBLIC_KEY ?? "",
    vercelToken: process.env.VERCEL_TOKEN ?? "",
    repoSyncToken: process.env.REPO_SYNC_TOKEN ?? "",
  };

  if (config.nodeEnv === "production") {
    const required = [
      ["APP_API_TOKEN", config.appApiToken],
      ["PAYWALL_TOKEN", config.paywallToken],
      ["PAYWALL_PROVIDER_URL", config.paywallProviderUrl],
      ["PAYWALL_PUBLIC_KEY", config.paywallPublicKey],
    ].filter(([, value]) => !value);

    if (required.length > 0) {
      throw new Error(`Missing required production env: ${required.map(([name]) => name).join(", ")}`);
    }
  }

  return config;
}
