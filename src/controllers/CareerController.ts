import express from "express";
const careers = express.Router();
import dotenv from "dotenv";
import { CareerDAO } from "../dao/CareerDAO";
const careerDB = new CareerDAO();
dotenv.config();

careers.get("/", (req, res) => {
  careerDB.getAllCareers().then(
    (careers) => {
      res.status(200).json(careers);
    },
    (reason) => {
      res.status(404).send("Centres could not be returned " + reason);
    }
  );
});

careers.get("/:careerName", (req, res) => {
  careerDB.getCareerByName(req.params.careerName).then(
    (career) => {
      res.status(200).json(career);
    },
    (reason) => {
      res.status(404).send("Centres could not be returned " + reason);
    }
  );
});

careers.get("/career", (req, res) => {
  var query = require("url").parse(req.url, true).query;

  if (query.name !== undefined && query.id === undefined) {
    careerDB.getCareerByName(query.name).then(
      (centre) => {
        res.status(200).json(centre);
      },
      (reason) => {
        res.status(404).send("Career could no be returned: " + reason);
      }
    );
  } else if (query.id !== undefined && query.name === undefined) {
    careerDB.getCareerById(query.id).then(
      (centre) => {
        res.status(200).json(centre);
      },
      (reason) => {
        res.status(404).send("Career could no be returned: " + reason);
      }
    );
  } else if (
    (query.name !== undefined && query.id !== undefined) ||
    (query.name === undefined && query.id === undefined)
  ) {
    res.status(400).send("Must send either an id or a name");
  }
});

export default careers;
