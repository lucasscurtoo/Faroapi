import { OkPacket } from "mysql2";
import career from "../controllers/CareerController";
import { db } from "../database/Database";
import { Career, Career_db, keyword_db } from "../model/Career";

export class CareerDAO {
  getCareerById(careerId: number): Promise<Career | undefined> {
    let career: Career;
    return new Promise((resolve, reject) => {
      db.query<Career_db[]>(
        "SELECT * FROM CAREER WHERE id_career = ?",
        [careerId],
        (err, res) => {
          if (err) reject(err);
          else {
            if (res?.[0] !== undefined) {
              career = new Career(
                res?.[0].id_career,
                res?.[0].career_name,
                res?.[0].career_description,
                res?.[0].grade,
                res?.[0].duration
              );
              this.getKeywordsByCareer(career.getId_career()).then(
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
      db.query<Career_db[]>("select * from CAREER", async (err, res) => {
        if (err) reject(err);
        else {
          const careers = await Promise.all(
            res.map((career) => this.getCareerById(career.id_career))
          );
          resolve(careers);
        }
      });
    });
  }

  getCareerByName(careerName: string): Promise<Career> {
    return new Promise((resolve, reject) => {
      db.query<Career_db[]>(
        "SELECT * FROM CAREER WHERE career_name = ?",
        [careerName],
        (err, res) => {
          if (err) reject(err);
          else {
            if (res?.[0].career_name !== undefined) {
              this.getCareerById(res?.[0].id_career).then((career) => {
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

  getCareersByCentre(centreId: number): Promise<Career[]> {
    let careers: Array<Career> = [];
    return new Promise((resolve, reject) => {
      db.query<Career_db[]>(
        "select * from CAREER natural join CENTRE_CAREER where id_centre = ?",
        [centreId],
        (err, res) => {
          if (err) reject(err);
          else {
            res.forEach((car) => {
              careers.push(
                new Career(
                  car.id_career,
                  car.career_name,
                  car.career_description,
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
      db.query<keyword_db[]>(
        "select * from KEYWORD natural join CAREER_KEYWORD where id_career= ?",
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

  /*
  getCareerByCentreName(centreName: string): Promise<Career_db | undefined> {
    let careers: Career[];
    return new Promise((resolve, reject) => {
      db.query<OkPacket>(
        "select * from CAREER natural join CENTRE_CAREER where centre_name = ?",
        [centreName],
        (err, res) => {
          if (err) reject(err);
          else resolve(res.forEach((obj)=>{
            careers.push(Object.assign(new Career(), obj));
          }));
        }
      );
    });
  }
*/

  vinculateCareerKeyword(keyword: string, id_career: number) {
    return new Promise((resolve, reject) => {
      db.query<OkPacket>(
        "call vin_career_keyword(?,?)",
        [keyword, id_career],
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }

  vinculateCentreCareer(id_centre: number, id_career: number) {
    return new Promise((resolve, reject) => {
      db.query<OkPacket>(
        "INSERT INTO CENTRE_CAREER (id_centre, id_career) VALUES(?,?)",
        [id_centre, id_career],
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }

  createCareer(careers: Career[], centreId: number): Promise<OkPacket> {
    return new Promise((resolve, reject) => {
      careers.forEach((career) => {
        db.query<OkPacket>(
          "INSERT INTO CAREER (career_name, career_description, grade, duration) VALUES(?,?,?,?)",
          [
            career.getCareer_name(),
            career.getCareer_description(),
            career.getGrade(),
            career.getDuration(),
          ],
          (err, res) => {
            if (err) {
              if (err.code === "ER_DUP_ENTRY") {
                this.getCareerByName(career.getCareer_name())
                  .then((c) => {
                    this.vinculateCentreCareer(centreId, c.getId_career());
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
