import express from "express";
const centres = express.Router();
import dotenv from "dotenv";
import { CentreDAO } from "../dao/CentreDAO";
const centreDB = new CentreDAO();
import { CareerDAO } from "../dao/CareerDAO";
const careerDB = new CareerDAO();
import { Centre } from "../model/Centre";

dotenv.config();

centres.post("/", (req, res) => {
  const centre: Centre = Object.assign(new Centre(), req.body);
  centreDB.createCentre(centre).then(
    () => {
      res.status(200).send("Centre succesfully created");
    },
    (reason) => {
      res.status(404).send("Centre could not be created : " + reason);
    }
  );
});

centres.get("/", (req, res) => {
  centreDB.getAllCentres().then(
    (centre) => {
      res.status(200).json(centre);
    },
    (reason) => {
      res.status(404).send("Centres could no be returned: " + reason);
    }
  );
});

centres.get("/centre", (req, res) => {
  var query = require("url").parse(req.url, true).query;

  if (query.name !== undefined && query.id === undefined) {
    centreDB.getCentreByName(query.name).then(
      (centre) => {
        res.status(200).json(centre);
      },
      (reason) => {
        res.status(404).send("Centre could no be returned: " + reason);
      }
    );
  } else if (query.id !== undefined && query.name === undefined) {
    centreDB.getCentre(query.id).then(
      (centre) => {
        res.status(200).json(centre);
      },
      (reason) => {
        res.status(404).send("Centre could no be returned: " + reason);
      }
    );
  } else if (
    (query.name !== undefined && query.id !== undefined) ||
    (query.name === undefined && query.id === undefined)
  ) {
    res.status(400).send("Must send either an id or a name");
  }
});

/*
//get query&params in express

//etc. example.com/user/000000?sex=female

app.get('/user/:id', function(req, res) {

  const query = req.query;// query = {sex:"female"}

  const params = req.params; //params = {id:"000000"}

})

/*
centre.get("/:centreName", (req, res) => {
  centreDB.getCentreByName(req.params.centreName).then(
    (centre) => {
      res.status(200).json(centre);
    },
    (reason) => {
      res.status(404).send("Centre could no be returned: " + reason);
    }
  );
})
*/

export default centres;
