import express from "express";
const app = express();
import { requireJwtMiddleware } from "./controllers/AdminController";
import login from "./controllers/AdminController";
import centres from "./controllers/CentreController";
import careers from "./controllers/CareerController";

import * as dotenv from "dotenv";
dotenv.config();

/*-------------------Imports-------------------*/

/*Cors*/
import cors from "cors";
app.use(cors());

/*Json Parser*/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*Listen endpoints of AdminController in /login */
/*No Middleware configured*/
app.use("/login", login);

/*Middleware that'll control JWT, this app uses refresh token. More details in AdminController class*/
/*Middleware is active from now on*/
app.use(requireJwtMiddleware);

/*Listen routes*/
app.use("/centres", centres);
app.use("/careers", careers);

/*Run app*/
app.listen(process.env.PORT, () => {
  console.log(`server started at http://localhost:${process.env.PORT}`);
});
