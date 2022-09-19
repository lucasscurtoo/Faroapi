import express from "express";
const centres = express.Router();
import dotenv from "dotenv";
import { CentreDAO } from "../dao/CentreDAO";
const centreDB = new CentreDAO();
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

centres.patch("/:idCentre", (req, res) => {
  const centre: Centre = Object.assign(new Centre(), req.body);
  centreDB.updateCentre(parseInt(req.params.idCentre, 10), centre).then(
    () => {
      res.status(200).send("Centre succesfully edited");
    },
    (reason) => {
      res.status(404).send("Centre could not be edited : " + reason);
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

centres.get("/centresName", (req, res) => {
  centreDB.getAllCentresName().then(
    (centre) => {
      res.status(200).json(centre);
    },
    (reason) => {
      res.status(404).send("Centres could no be returned: " + reason);
    }
  );
});

centres.get("/centre", (req, res) => {
  const query = require("url").parse(req.url, true).query;
  const byId = query.id ? true : false;
  const byName = query.name ? true : false;
  const byCareer = query.idCareer ? true : false;

  if (byName && !byId) {
    centreDB.getCentreByName(query.name).then(
      (centre) => {
        res.status(200).json(centre);
      },
      (reason) => {
        res.status(404).send("Centre could no be returned: " + reason);
      }
    );
  } else if (byId && !byName) {
    centreDB.getCentre(query.id).then(
      (centre) => {
        res.status(200).json(centre);
      },
      (reason) => {
        res.status(404).send("Centre could no be returned: " + reason);
      }
    );
  } else if (byCareer) {
    centreDB.getCentresByCareer(query.idCareer).then(
      (centres) => {
        res.status(200).json(centres);
      },
      (reason) => {
        res.status(404).send("Centre could no be returned: " + reason);
      }
    );
  } else {
    res.status(400).send("Must send either an id or a name");
  }
});

centres.delete("/:id", (req, res) => {
  centreDB.deleteCentre(parseInt(req.params.id, 10)).then(
    () => {
      res.status(200).send("Centre was succesfully deleted");
    },
    (reason) => {
      res.status(404).send("Centre could not be deleted: " + reason);
    }
  );
});

export default centres;
