import { Elysia, file, t } from "elysia";
import { staticPlugin } from "@elysiajs/static"
import Database from "bun:sqlite";
import authRoutes from "./routes/authRoutes"

export const indexHTMLpath = `${__dirname}/../../client/dist/index.html`;
const room = new Set<WebSocket>();

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
      const re = new RegExp("(?:http|https)\:\/\/.+")
      if (re.test(message.image) === false) message.image = "";
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
  .get("/message", () => {
    query = db.query("SELECT * FROM message ORDER BY id DESC LIMIT 10;");
    return query.all().reverse();
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
