import express from "express";
const app = express();
import { requireJwtMiddleware } from "./controllers/AdminController";
import login from "./controllers/AdminController";
import centres from "./controllers/CentreController";
import careers from "./controllers/CareerController";

import * as dotenv from "dotenv";
dotenv.config();

const cors = require("cors");
app.use(cors());

/* NEW */
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
