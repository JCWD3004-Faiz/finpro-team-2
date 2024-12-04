import express from "express";
import environment from "dotenv";
import cors from "cors";

import adminAuthRouter from "./routers/admin.auth.router"
import superAdminRouter from "./routers/super.admin.router"

environment.config();

const app = express();
const PORT = process.env.SERVER_PORT_DEV;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/api/admin-auth", adminAuthRouter);

app.use("/api/super-admin", superAdminRouter);

app.listen(PORT, () => {
  console.log(`Listening on port : ${PORT}`);
});
