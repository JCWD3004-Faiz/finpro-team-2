import express from "express";
import oauthRouter from "./routers/oauth.router";
import userAuthRouter from "./routers/user.auth.router";

import environment from "dotenv";
import cors from "cors";

import profileRouter from "./routers/profile.router";
import cartRouter from "./routers/cart.router";
import orderRouter from "./routers/order.router";
import superAdminRouter from "./routers/super.admin.router"
import storeAdminRouter from "./routers/store.admin.router"
import inventoryRouter from "./routers/inventory.router"
import productRouter from "./routers/product.router"
import userRouter from "./routers/user.router"

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
app.use("/api/profile", profileRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/super-admin", superAdminRouter);
app.use("/api/store-admin", storeAdminRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);


app.listen(PORT, () => {
  console.log(`Listening on port : ${PORT}`);
});
