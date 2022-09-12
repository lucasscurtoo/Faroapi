import { OkPacket } from "mysql2";
import { Centre, CentreDB } from "../model/Centre";
import { db } from "../database/Database";
import { Career } from "../model/Career";
import { CareerDAO } from "./CareerDAO";
const careerDB = new CareerDAO();

export class CentreDAO {
  getCentre(id: number): Promise<Centre | undefined> {
    let centre: Centre;
    return new Promise((resolve, reject) => {
      db.query<CentreDB[]>(
        "SELECT * FROM CENTRE WHERE id_centre = ?",
        [id],
        (err, res) => {
          if (err) reject(err);
          else {
            if (res?.[0] !== undefined) {
              let centreData = res?.[0];
              centre = new Centre(
                centreData.id_centre,
                centreData.centre_name,
                Boolean(centreData.free),
                centreData.adress,
                centreData.latitude,
                centreData.longitude,
                centreData.centre_schedule
              );
              careerDB
                .getCareersByCentre(centre.getIdCentre())
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
      db.query<CentreDB[]>("SELECT * FROM CENTRE", async (err, res) => {
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
      db.query<CentreDB[]>(
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
      db.query<CentreDB[]>(
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
        "insert into CENTRE (centre_name, free, adress, latitude, longitude, centre_schedule, phone_number) values(?,?,?,?,?,?,?)",
        [
          centre.getCentreName(),
          centre.isFree(),
          centre.getAdress(),
          centre.getLatitude(),
          centre.getLongitude(),
          centre.getCentreSchedule(),
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

  updateCentre(id: number, centre: Centre): Promise<Centre> {
    return new Promise((resolve, reject) => {
      db.query<OkPacket>(
        "UPDATE CENTRE set centre_name=?, free=?, latitude=?, longitude=?, centre_schedule=?, phone_number=? where id_centre = ?",
        [
          centre.getCentreName(),
          Boolean(centre.isFree()),
          centre.getAdress(),
          centre.getLatitude(),
          centre.getLongitude(),
          centre.getCentreSchedule(),
          centre.getPhoneNumber(),
          id,
        ],
        (err, res) => {
          if (err) reject(err);
          else {
            this.getCentre(id)
              .then((centre) => resolve(centre!))
              .catch(reject);
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
