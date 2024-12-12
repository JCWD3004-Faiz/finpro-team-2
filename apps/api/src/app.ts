import express from "express";
import oauthRouter from "./routers/oauth.router";
import userAuthRouter from "./routers/user.auth.router";
import userProfileRouter from "./routers/user.profile.router";

import environment from "dotenv";
import cors from "cors";

import superAdminRouter from "./routers/super.admin.router"
import storeAdminRouter from "./routers/store.admin.router"
import inventoryRouter from "./routers/inventory.router"

import passport from "passport";
environment.config();

const app = express();
const PORT = process.env.SERVER_PORT_DEV;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);



app.use(passport.initialize());

app.use("/api/auth", userAuthRouter);
app.use("/auth", oauthRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/super-admin", superAdminRouter);
app.use("/api/store-admin", storeAdminRouter);
app.use("/api/user-profile", userProfileRouter);


app.listen(PORT, () => {
  console.log(`Listening on port : ${PORT}`);
});
