import express from "express";
import oauthRouter from "./routers/oauth.router";
import userAuthRouter from "./routers/user.auth.router";
import environment from "dotenv";
import passport from "passport";
environment.config();

const app = express();
const PORT = process.env.SERVER_PORT_DEV;

app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", userAuthRouter);
app.use("/auth", oauthRouter);

app.listen(PORT, () => {
  console.log(`Listening on port : ${PORT}`);
});
