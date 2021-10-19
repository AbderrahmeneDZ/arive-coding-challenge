import dotenv from "dotenv";
import config from "config";

dotenv.config();

import appInit from "./src/app";

import { createServer } from "http";

(async () => {
  const PORT = process.env.PORT || 8081;

  const app = await appInit();
  app.set("port", PORT);

  const server = createServer(app);

  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
    console.log(`Database : ${config.get("DB.CONNECTION")}`);
  });
})();
