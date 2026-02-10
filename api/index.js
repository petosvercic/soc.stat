import { initConfig } from "../src/config.mjs";
import { appHandler } from "../src/app.mjs";

const config = initConfig(process.cwd());

export default async function handler(req, res) {
  return appHandler(req, res, config);
}
