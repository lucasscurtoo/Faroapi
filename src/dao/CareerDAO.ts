import { OkPacket } from "mysql2";
import { db } from "../database/Database";
import { Career, CareerDB, KeywordDB } from "../model/Career";

export class CareerDAO {
  getCareerById(careerId: number): Promise<Career | undefined> {
    let career: Career;
    return new Promise((resolve, reject) => {
      db.query<CareerDB[]>(
        "SELECT * FROM CAREER WHERE idCareer = ?",
        [careerId],
        (err, res) => {
          if (err) reject(err);
          else {
            if (res?.[0] !== undefined) {
              let careerR = res?.[0];
              career = new Career(
                careerR.idCareer,
                careerR.careerName,
                careerR.careerDescription,
                careerR.grade,
                careerR.duration
              );
              this.getKeywordsByCareer(career.getIdCareer()).then(
                (keywords) => {
                  career.setKeywords(keywords);
                  resolve(career);
                }
              );
            } else {
              reject("Career not found");
            }
          }
        }
      );
    });
  }

  getAllCareers(): Promise<Career[]> {
    return new Promise((resolve, reject) => {
      db.query<CareerDB[]>("select * from CAREER", async (err, res) => {
        if (err) reject(err);
        else {
          const careers = await Promise.all(
            res.map((career) => this.getCareerById(career.idCareer))
          );
          resolve(careers);
        }
      });
    });
  }

  getCareerByName(careerName: string): Promise<Career> {
    return new Promise((resolve, reject) => {
      db.query<CareerDB[]>(
        "SELECT * FROM CAREER WHERE careerName = ?",
        [careerName],
        (err, res) => {
          if (err) reject(err);
          else {
            if (res?.[0].careerName !== undefined) {
              this.getCareerById(res?.[0].idCareer).then((career) => {
                resolve(career);
              });
            } else {
              reject("Career not found");
            }
          }
        }
      );
    });
  }

  getAllCentresName(): Promise<Career[]> {
    let careers: Array<Career> = [];
    return new Promise((resolve, reject) => {
      db.query<CareerDB[]>(
        "SELECT idCareer, centreName FROM CAREER",
        (err, res) => {
          if (err) reject(err);
          else {
            res.forEach((car) => {
              careers.push(new Career(car.idCareer, car.careerName));
            });
            resolve(careers);
          }
        }
      );
    });
  }

  getCareersByCentre(centreId: number): Promise<Career[]> {
    let careers: Array<Career> = [];
    return new Promise((resolve, reject) => {
      db.query<CareerDB[]>(
        "select * from CAREER natural join CENTRE_CAREER where idCentre = ?",
        [centreId],
        (err, res) => {
          if (err) reject(err);
          else {
            res.forEach((car) => {
              careers.push(
                new Career(
                  car.idCareer,
                  car.careerName,
                  car.careerDescription,
                  car.grade,
                  car.duration
                )
              );
            });
            resolve(careers);
          }
        }
      );
    });
  }

  getKeywordsByCareer(careerId: number): Promise<string[]> {
    let keywords: Array<string> = [];
    return new Promise((resolve, reject) => {
      db.query<KeywordDB[]>(
        "select * from KEYWORD natural join CAREER_KEYWORD where idCareer= ?",
        [careerId],
        (err, res) => {
          if (err) reject(err);
          else {
            res.forEach((word) => {
              keywords.push(word.keyword);
            });
            resolve(keywords);
          }
        }
      );
    });
  }

  vinculateCareerKeyword(keyword: string, idCareer: number) {
    return new Promise((resolve, reject) => {
      db.query<OkPacket>(
        "call vin_career_keyword(?,?)",
        [keyword, idCareer],
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }

  vinculateCentreCareer(idCentre: number, idCareer: number) {
    return new Promise((resolve, reject) => {
      db.query<OkPacket>(
        "INSERT INTO CENTRE_CAREER (idCentre, idCareer) VALUES(?,?)",
        [idCentre, idCareer],
        (err, res) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
            } else reject(err);
          } else resolve(res);
        }
      );
    });
  }

  createCareer(careers: Career[], centreId: number): Promise<OkPacket> {
    return new Promise((resolve, reject) => {
      careers.forEach((career) => {
        db.query<OkPacket>(
          "INSERT INTO CAREER (careerName, careerDescription, grade, duration) VALUES(?,?,?,?)",
          [
            career.getCareerName(),
            career.getCareerDescription(),
            career.getGrade(),
            career.getDuration(),
          ],
          (err, res) => {
            if (err) {
              if (err.code === "ER_DUP_ENTRY") {
                this.getCareerByName(career.getCareerName())
                  .then((c) => {
                    this.vinculateCentreCareer(centreId, c.getIdCareer());
                  })
                  .then(() => resolve(res));
              } else {
                reject(err);
              }
            } else {
              const careerKeywords = career.getKeywords();
              if (careerKeywords !== undefined) {
                careerKeywords.forEach((keyword) => {
                  this.vinculateCareerKeyword(keyword, res.insertId);
                });
              }
              this.vinculateCentreCareer(centreId, res.insertId);
              resolve(res);
            }
          }
        );
      });
    });
  }
}
