import { Elysia, file, t } from "elysia";
import { jwt } from "@elysiajs/jwt"
import { staticPlugin } from "@elysiajs/static"
import Database from "bun:sqlite";
import authRoutes from "./routes/authRoutes"
import { ServerWebSocket } from "bun";
import { readFileSync } from "fs"
import { addEmote } from "./addEmote";

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
  .get("/emote", ({ jwt, status, cookie: {auth}}) => {
    if(!auth.value) return status(401);
    return file(indexHTMLpath)
  })
  .get("/api/emote", () => {
    // let availableEmotes = readdirSync(`${__dirname}/../../client/dist/emotes`);
    let availableEmotes = JSON.parse(readFileSync("./src/emotes.json", "utf-8"))
    return JSON.stringify(availableEmotes)
  })
  .post("/api/emote", ({ body, jwt, status, cookie: {auth}}) => {
    if(!auth.value) return status(401);
    const { emoteName, emoteUrl } = body as Record<string, string>;
    addEmote(emoteName, emoteUrl)
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
