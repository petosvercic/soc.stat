import { createAppServer } from "./app.mjs";

const server = createAppServer();
const port = Number(process.env.PORT ?? 3000);

server.listen(port, () => {
  console.log(`soc.stat app running on :${port}`);
});
