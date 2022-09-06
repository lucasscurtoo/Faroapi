import { OkPacket } from "mysql2";
import { Centre, Centre_db } from "../model/Centre";
import { db } from "../database/Database";
import { Career } from "../model/Career";
import { CareerDAO } from "./CareerDAO";
import centre from "../controllers/CentreController";
const careerDB = new CareerDAO();

export class CentreDAO {
  getCentre(id: number): Promise<Centre | undefined> {
    let centre: Centre;
    return new Promise((resolve, reject) => {
      db.query<Centre_db[]>(
        "SELECT * FROM CENTRE WHERE id_centre = ?",
        [id],
        (err, res) => {
          if (err) reject(err);
          else {
            if (res?.[0] !== undefined) {
              centre = new Centre(
                res?.[0].id_centre,
                res?.[0].centre_name,
                res?.[0].free,
                res?.[0].latitude,
                res?.[0].longitude,
                res?.[0].centre_schedule
              );
              careerDB
                .getCareersByCentre(centre.getId_centre())
                .then((careers) => {
                  centre.setCareers(careers);
                  resolve(centre);
                });
            } else {
              reject("Centre not found");
            }
          }
        }
      );
    });
  }

  getAllCentres(): Promise<Centre[]> {
    return new Promise((resolve, reject) => {
      db.query<Centre_db[]>("SELECT * FROM CENTRE", async (err, res) => {
        if (err) reject(err);
        else {
          const centres = await Promise.all(
            res.map((centre) => this.getCentre(centre.id_centre))
          );
          resolve(centres);
        }
      });
    });
  }

  getAllCentresName(): Promise<Centre[]> {
    let centres: Array<Centre> = [];
    return new Promise((resolve, reject) => {
      db.query<Centre_db[]>(
        "SELECT id_centre, centre_name FROM CENTRE",
        (err, res) => {
          if (err) reject(err);
          else {
            res.forEach((cen) => {
              centres.push(new Centre(cen.id_centre, cen.centre_name));
            });
            resolve(centres);
          }
        }
      );
    });
  }

  getCentreByName(centreName: string): Promise<Centre | undefined> {
    return new Promise((resolve, reject) => {
      db.query<Centre_db[]>(
        "select * from CENTRE natural join CAREER where centre_name = ?",
        [centreName],
        (err, res) => {
          if (err) reject(err);
          else {
            if (res?.[0] !== undefined) {
              this.getCentre(res?.[0].id_centre).then((centre) => {
                resolve(centre);
              });
            } else {
              reject("Centre not found");
            }
          }
        }
      );
    });
  }

  createCentre(centre: Centre): Promise<Centre> {
    const centreCareers = centre.getCareers().map((career) => {
      return Object.assign(new Career(), career);
    });

    return new Promise((resolve, reject) => {
      db.query<OkPacket>(
        "insert into CENTRE (centre_name, free, latitude, longitude, centre_schedule, phoneNumber) values(?,?,?,?,?,?)",
        [
          centre.getCentre_name(),
          centre.isFree(),
          centre.getLatitude(),
          centre.getLongitude(),
          centre.getCentre_schedule(),
          centre.getPhoneNumber(),
        ],
        (err, res) => {
          if (err) reject(err);
          else {
            if (centreCareers.length > 0) {
              careerDB.createCareer(centreCareers, res.insertId).then(() => {
                this.getCentre(res.insertId)
                  .then((centre) => resolve(centre!))
                  .catch(reject);
              });
            } else {
              this.getCentre(res.insertId)
                .then((centre) => resolve(centre!))
                .catch(reject);
            }
          }
        }
      );
    });
  }

  /*
  update(centre: Centre): Promise<Centre | undefined> {
    return new Promise((resolve, reject) => {
      db.query<OkPacket>(
        "UPDATE users SET email = ?, password = ?, admin = ? WHERE id = ?",
        [user.email, user.password, user.admin, user.id],
        (err, res) => {
          if (err) reject(err);
          else this.readById(user.id!).then(resolve).catch(reject);
        }
      );
    });
  }
  remove(user_id: number): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<OkPacket>(
        "DELETE FROM users WHERE id = ?",
        [user_id],
        (err, res) => {
          if (err) reject(err);
          else resolve(res.affectedRows);
        }
      );
    });
  }
  */
}
