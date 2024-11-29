import express from "express";
import featureRouter from "./routers/feature.router";
import environment from "dotenv";

environment.config();

const app = express();
const PORT = process.env.SERVER_PORT_DEV;

app.use(express.json());

// jalur utama dari api
app.get("/api", featureRouter);

app.listen(PORT, () => {
  console.log(`Listening on port : ${PORT}`);
});
