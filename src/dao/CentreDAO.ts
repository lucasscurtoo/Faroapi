import { OkPacket } from "mysql2";
import {
  Centre,
  CentreDB,
  CentreScheduleDB,
  schoolarLevelDB,
} from "../model/Centre";
import { db } from "../databaseCon/Database";
import { Career } from "../model/Career";
import { CareerDAO } from "./CareerDAO";
import { resolve } from "path";
import { selectCount } from "../model/Generics";
const careerDB = new CareerDAO();

/*-
Only first method (getCareerById) is explained in detail,
every other method has only very specific comments
in order to avoid unnecessary excesive documentation
-*/

export class CentreDAO {
  /*Method of type Promise of type Centre*/
  getCentre(id: number): Promise<Centre | undefined> {
    let centre: Centre;
    /*Database request are handled with Promises*/
    return new Promise((resolve, reject) => {
      /*Database requests are handled with Promises*/
      /*mysql2 driver requires classes that extend RowDataPacket*/
      db.query<CentreDB[]>(
        /*Raw mysql query*/
        "select idCentre, centreName, free, addressStreet, addressNumber, latitude, longitude, phoneNumber, schoolarLevel, group_concat(centreSchedule) as centreSchedules from centre natural left join centre_schedules natural left join schoolarlevel natural left join SCHEDULES where idCentre=?",
        /*Every sent paramether will match every '?' mark*/
        [id],
        /*callback*/
        async (err, res) => {
          /*If error then reject the promise*/
          if (err) reject(err);
          else {
            /*if something was returned from database*/
            if (res?.[0].centreName !== null) {
              /*Just an assistant variable*/
              const centreData = res?.[0];
              /*Create a new centre (type Centre)*/
              centre = new Centre(
                centreData.idCentre,
                centreData.centreName,
                Boolean(centreData.free),
                centreData.addressStreet,
                centreData.addressNumber,
                centreData.latitude,
                centreData.longitude,
                centreData.centreSchedules,
                centreData.schoolarLevel,
                centreData.phoneNumber
              );
              /*then call method getCareers from careerDB in order to set the careers of the centre*/
              await careerDB
                .getCareersByCentre(centre.getIdCentre())
                .then((careers) => {
                  centre.setCareers(careers);
                })
                .catch((err) => resolve(centre));
              resolve(centre);
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
          /*In order to create an array of type centre we must first get all centres.
          Promise.all is a method from promise that will multiple allow asynchronic call*/
          const centres = await Promise.all(
            res.map((centre) => this.getCentre(centre.idCentre))
          );
          resolve(centres);
        }
      });
    });
  }

  getAllCentresName(): Promise<Centre[]> {
    const centres: Centre[] = [];
    return new Promise((resolve, reject) => {
      db.query<CentreDB[]>(
        "SELECT idCentre, centreName FROM CENTRE",
        (err, res) => {
          if (err) reject(err);
          else {
            res.forEach((cen) => {
              centres.push(new Centre(cen.idCentre, cen.centreName));
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
        "select * from CENTRE natural join CAREER where centreName = ?",
        [centreName],
        (err, res) => {
          if (err) reject(err);
          else {
            if (res?.[0] !== undefined) {
              /*In order to avoid repitive code, this method only gets the id from row
            that matches that name and then calls the 'getById' */
              this.getCentre(res?.[0].idCentre).then((centre) => {
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

  /*Get centres that are related to a specific career*/
  getCentresByCareer(idCareer: number): Promise<Centre | undefined> {
    return new Promise((resolve, reject) => {
      db.query<CentreDB[]>(
        "select idCentre from CAREER natural join CENTRE_CAREER where idCareer = ?",
        [idCareer],
        (err, res) => {
          if (err) reject(err);
          else {
            if (res?.[0]) {
              this.getCentre(res?.[0].idCentre).then((centre) => {
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

  getCentreSchedules(idCentre: number): Promise<string[]> {
    const schedules = new Array<string>();
    return new Promise((resolve, reject) => {
      db.query<CentreScheduleDB[]>(
        "select centreSchedule from CENTRE_SCHEDULE natural join SCHEDULES where idCentre= ?",
        [idCentre],
        (err, res) => {
          if (err) reject(err);
          else {
            res.forEach((sch) => schedules.push(sch.centreSchedule));
            resolve(schedules);
          }
        }
      );
    });
  }

  getCentreLevels(idCentre: number): Promise<string> {
    const schedules = new Array<string>();
    return new Promise((resolve, reject) => {
      db.query<schoolarLevelDB[]>(
        "select schoolarLevel from SCHOOLARLEVEL natural join CENTRE where idCentre= ?",
        [idCentre],
        (err, res) => {
          if (err) reject(err);
          else {
            resolve(res?.[0].schoolarLevel);
          }
        }
      );
    });
  }

  vinculateCentreSchoolarLevel(idCentre: number, scholarLevel: string) {
    return new Promise((resolve, reject) => {
      db.query<OkPacket>(
        "call DBFiller_Centre_VinculateSchoolarLevel(?,?)",
        [idCentre, scholarLevel],
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
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
        "insert into CENTRE (centreName, free, addressStreet, addressNumber, latitude, longitude, phoneNumber) values(?,?,?,?,?,?,?)",
        [
          centre.getCentreName(),
          centre.isFree(),
          centre.getAddressStreet(),
          centre.getAddressNumber(),
          centre.getLatitude(),
          centre.getLongitude(),
          centre.getPhoneNumber(),
        ],
        async (err, res) => {
          if (err) reject(err);
          else {
            /*For every given schedule vinculate it to the centre*/
            await this.vinculateCentreSchedules(
              res.insertId,
              centre.getCentreSchedules()
            );
            /*For the given schoolar level, vinculate it to the centre*/
            await this.vinculateCentreSchoolarLevel(
              res.insertId,
              centre.getSchoolarLevel()
            );
            /*For every given career vinculate it to the centre*/
            if (centreCareers.length > 0) {
              await careerDB
                .createCareer(centreCareers, res.insertId)
                .then(() => {
                  this.getCentre(res.insertId)
                    .then((centre) => resolve(centre!))
                    .catch(reject);
                });
            }
            /*else {
              this.getCentre(res.insertId)
                .then((centre) => resolve(centre!))
                .catch(reject);

            }*/
          }
        }
      );
    });
  }

  deleteSchedules(idCentre: number) {
    return new Promise((resolve, reject) => {
      db.query<OkPacket>(
        "delete FROM CENTRE_SCHEDULES where idCentre=?",
        [idCentre],
        (err, res) => {
          if (err) reject(err);
          else {
            console.log("delete schedules");
            resolve(res);
          }
        }
      );
    });
  }

  vinculateCentreSchedules(idCentre: number, schedule: string[]) {
    return new Promise((resolve, reject) => {
      schedule.forEach((sch) => {
        db.query<OkPacket>(
          "call DBFiller_Centre_VinculateSchedules(?,?)",
          [idCentre, sch],
          (err, res) => {
            if (err) reject(err);
            else resolve(res);
          }
        );
      });
    });
  }

  updateSchedules(schedules: string[], idCentre: number) {
    return new Promise((resolve, reject) => {
      this.deleteSchedules(idCentre).then(() => {
        this.vinculateCentreSchedules(idCentre, schedules).then((res) => {
          resolve(res);
        });
      });
    });
  }

  updateCentre(id: number, centre: Centre): Promise<Centre> {
    return new Promise((resolve, reject) => {
      db.query<OkPacket>(
        "UPDATE CENTRE set centreName=?, free=?, addressStreet=?, addressNumber=?, latitude=?, longitude=?, phoneNumber=? where idCentre = ?",
        [
          centre.getCentreName(),
          centre.isFree(),
          centre.getAddressStreet(),
          centre.getAddressNumber(),
          centre.getLatitude(),
          centre.getLongitude(),
          centre.getPhoneNumber(),
          id,
        ],
        async (err, res) => {
          if (err) reject(err);
          else {
            await this.updateSchedules(centre.getCentreSchedules(), id);
            this.getCentre(id)
              .then((centre) => resolve(centre!))
              .catch(reject);
          }
        }
      );
    });
  }

  deleteCentre(idCentre: number): Promise<number> {
    return new Promise((resolve, reject) => {
      db.query<OkPacket>(
        "call DBFiller_Centre_Delete(?)",
        [idCentre],
        async (err, res) => {
          if (err) reject(err);
          else {
            console.log("Like, it was deleted, but");
            if (res.affectedRows === 0) reject(Error("Centre not found"));
            else {
              console.log("Delete centre succesfull");
              await this.deleteSchedules(idCentre);
              await careerDB.clearCareers(idCentre);
              resolve(res.affectedRows);
            }
          }
        }
      );
    });
  }
}
