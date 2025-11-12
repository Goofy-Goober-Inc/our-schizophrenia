import { Elysia, file, redirect } from 'elysia'
import { indexHTMLpath } from '../index';
import { jwt } from "@elysiajs/jwt"
import Database from 'bun:sqlite';

const db = new Database("db.db")
let query = db.query("CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT, username VARCHAR NOT NULL UNIQUE, password VARCHAR NOT NULL)")
query.run();

const authRoutes = new Elysia()
  .use(jwt({
    name: "jwt",
    secret: "ahuet ne vstat secret"
  }))
  .get("/login", () => file(indexHTMLpath))
  .get("/register", () => file(indexHTMLpath))
  .post("/api/register", ({ body }) => {
    const { username, password } = body as Record<string, string>;
    console.log(`Registered user: ${username}\nPassword: ${password}`); // uga buga
  })
  .post("/api/login", async ({body, jwt, cookie: { auth }}) => {
    const { username, password } = body as Record<string, string>;

    query = db.query("SELECT * FROM user WHERE username=?1");
    let result: any = query.get(username);

    if(result && result.password === password) {
      console.log(result)
      const value = await jwt.sign({
        id: result.id,
        username: result.username
      });

      auth.set({
        value,
        httpOnly: true,
        maxAge: 7 * 86400,
        path: "/"
      })

    }
  })
  .get("/user", async ({ jwt, status, cookie: {auth}}) => {
    if(!auth.value) return status(401)

    const user = await jwt.verify(auth.value)
    if (!user) {
      return status(401)
    }

    return {
      username: user.username
    }
  })
  .get("/logout", ({cookie: {auth}}) => {
    auth.set({
      value: "",
      httpOnly: true,
      maxAge: 0,
      path: "/"
    })

    return redirect("/login")
  })

export default authRoutes;