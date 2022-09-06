import express from "express";
const app = express();
import cors from "cors";
import { requireJwtMiddleware } from "./controllers/AdminController";
import login from "./controllers/AdminController";
import centres from "./controllers/CentreController";
import careers from "./controllers/CareerController";

import * as dotenv from "dotenv";
dotenv.config();

const allowedOrigins = ["http://localhost:7000"];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options)); /* NEW */
app.use(express.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/login", login);

app.use(requireJwtMiddleware);

app.use("/centres", centres);
app.use("/careers", careers);

app.listen(process.env.PORT, () => {
  console.log(`server started at http://localhost:${process.env.PORT}`);
});
