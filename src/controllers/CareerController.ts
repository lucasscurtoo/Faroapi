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
      res.status(404).send("Careers could not be returned " + reason);
    }
  );
});

careers.get("/career", (req, res) => {
  const query = require("url").parse(req.url, true).query;

  const byId = query.id ? true : false;
  const byName = query.name ? true : false;
  const byCentre = query.centreId ? true : false;

  if (byId && !byName) {
    careerDB.getCareerById(query.id).then(
      (career) => {
        res.status(200).json(career);
      },
      (reason) => {
        res.status(404).send("Career could no be returned: " + reason);
      }
    );
  } else if (byName && !byId) {
    careerDB.getCareerByName(query.name).then(
      (career) => {
        res.status(200).json(career);
      },
      (reason) => {
        res.status(404).send("Career could no be returned: " + reason);
      }
    );
  } else if (byCentre) {
    careerDB.getCareersByCentre(query.centreId).then(
      (career) => {
        res.status(200).json(career);
      },
      (reason) => {
        res.status(404).send("Career could no be returned: " + reason);
      }
    );
  } else {
    res.status(400).send("Must send either an id, a name or a centre");
  }
});

careers.delete("/career", (req, res) => {
  const query = require("url").parse(req.url, true).query;

  if (!query.idCareer || !query.idCentre) {
    res.status(400).send("Must send both id of career and id of centre");
  } else {
    careerDB.deleteCareer(query.idCareer, query.idCentre).then(
      (response) => {
        res
          .status(200)
          .send("Career was succesfully desvinculated from centre");
      },
      (reason) => {
        res.status(404).send("Career could not be desvinculated: " + reason);
      }
    );
  }
});

export default careers;
