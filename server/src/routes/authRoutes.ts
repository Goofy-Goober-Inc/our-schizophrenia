import { Elysia, file } from 'elysia'
import { indexHTMLpath } from '../index';

const authRoutes = new Elysia()
  .get("/login", () => file(indexHTMLpath))
  .get("/register", () => file(indexHTMLpath))
  .post("/register", (ctx) => {
    const { username, password } = ctx.body as Record<string, string>;
    console.log(`Registered user: ${username}\nPassword: ${password}`);
  })
  .post("/login", (ctx) => {
    const { username, password } = ctx.body as Record<string, string>;
    console.log(`Login attempt:\nUsername: ${username}\nPassword: ${password}`);
  })

export default authRoutes;