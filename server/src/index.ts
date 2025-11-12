import { Elysia, file, t } from "elysia";
import { staticPlugin } from "@elysiajs/static"
import Database from "bun:sqlite";
import authRoutes from "./routes/authRoutes"
import { ServerWebSocket } from "bun";
import { readdirSync } from "fs"

export const indexHTMLpath = `${__dirname}/../../client/dist/index.html`;
const room = new Set<ServerWebSocket>();

const db = new Database("db.db", { create: true});
let query = db.query("CREATE TABLE IF NOT EXISTS message(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR, message VARCHAR, image VARCHAR);")
query.run();

const app = new Elysia()
  .use(staticPlugin({
    assets: `${__dirname}/../../client/dist`,
    prefix: "",
  }))
  .use(authRoutes)
  .ws("/chat", {
    body: t.Any(),
    response: t.Any(),
    open(ws) {
      console.log("Connected")
      room.add(ws);
    },
    message(ws, message) {
      console.log(message)

      const re = /(?:http|https)\:\/\/.+/
      if (re.test(message.image) === false) message.image = null;

      query = db.query(`INSERT INTO message("username", "message", "image") VALUES($username, $message, $image);`)
      query.run({
        $username: message.username,
        $message: message.message,
        $image: message.image
      });

      for (const client of room) client.send(message)
    },
  })
  .get("/", () => file(indexHTMLpath))
  .get("/api/message", () => {
    query = db.query("SELECT * FROM message ORDER BY id DESC LIMIT 10;");
    return query.all().reverse();
  })
  .get("/api/emotes", () => {
    let availableEmotes = readdirSync(`${__dirname}/../../client/dist/emotes`);
    return {
      availableEmotes
    };
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
