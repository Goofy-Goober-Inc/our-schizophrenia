import { Elysia, file, t } from "elysia";
import { staticPlugin } from "@elysiajs/static"
import { treaty } from "@elysiajs/eden"
import authRoutes from "./routes/authRoutes"

export const indexHTMLpath = `${__dirname}/../../client/dist/index.html`;
const room = new Set<WebSocket>();

const app = new Elysia()
  .use(staticPlugin({
    assets: `${__dirname}/../../client/dist`,
    prefix: "",
  }))
  .use(authRoutes)
  .ws("/chat", {
    body: t.String(),
    response: t.Any(),
    open(ws) {
      console.log("Connected")
      room.add(ws);
    },
    message(ws, message) {
      console.log(message)

      for (const client of room) client.send(message)
    },
  })
  .get("/", () => file(indexHTMLpath))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
