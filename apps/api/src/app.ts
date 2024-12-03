import express from "express";
import environment from "dotenv";

import adminAuthRouter from "./routers/admin.auth.router"

environment.config();

const app = express();
const PORT = process.env.SERVER_PORT_DEV;

app.use(express.json());

app.use("/api/admin-auth", adminAuthRouter);

app.listen(PORT, () => {
  console.log(`Listening on port : ${PORT}`);
});
