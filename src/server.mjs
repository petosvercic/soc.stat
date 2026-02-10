import { initConfig } from "./config.mjs";
import { createAppServer } from "./app.mjs";

const config = initConfig();
const server = createAppServer(config);

server.listen(config.port, () => {
  console.log(`soc.stat app running on :${config.port}`);
});
