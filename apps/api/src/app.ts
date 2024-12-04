import express from "express";
import featureRouter from "./routers/feature.router";
import userAuthRouter from "./routers/user.auth.router";
import environment from "dotenv";

environment.config();

const app = express();
const PORT = process.env.SERVER_PORT_DEV;

app.use(express.json());

app.use("/api/auth", userAuthRouter);

app.listen(PORT, () => {
  console.log(`Listening on port : ${PORT}`);
});
