import express from "express";

import featureRouter from "./routers/feature.router";
import userAuthRouter from "./routers/user.auth.router";

import environment from "dotenv";
import cors from "cors";

import superAdminRouter from "./routers/super.admin.router"
import storeAdminRouter from "./routers/store.admin.router"

environment.config();

const app = express();
const PORT = process.env.SERVER_PORT_DEV;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);



app.use("/api/auth", userAuthRouter);

app.use("/api/super-admin", superAdminRouter);
app.use("/api/store-admin", storeAdminRouter);


app.listen(PORT, () => {
  console.log(`Listening on port : ${PORT}`);
});
