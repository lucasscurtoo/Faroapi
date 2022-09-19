import { OkPacket } from "mysql2";
import { db } from "../databaseCon/Database";
import { countKeywords, KeywordDB } from "../model/Keyword";

export class KeywordDAO {
  getKeywordsByCareer(careerId: number): Promise<string[]> {
    const keywords: string[] = [];
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

  getKeywords(): Promise<KeywordDB[]> {
    return new Promise((resolve, reject) => {
      db.query<KeywordDB[]>("select * from KEYWORD", async (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  deleteKeywords(idKeyword: number): Promise<number> {
    return new Promise((resolve, reject) => {
      db.query<OkPacket>(
        "delete from KEYWORD where idKeyword=?",
        [idKeyword],
        (err, res) => {
          if (err) reject(err);
          else {
            res.affectedRows === 0
              ? reject(Error("Keyword not found"))
              : resolve(res?.[0]);
          }
        }
      );
    });
  }

  clearKeywords(): Promise<countKeywords[]> {
    return new Promise(async (resolve, reject) => {
      const keywords = await this.getKeywords();
      keywords.forEach((keyword) => {
        db.query<countKeywords[]>(
          "select count(idKeyword) as total from CAREER_KEYWORD where idKeyword=?",
          [keyword.idKeyword],
          (err, res) => {
            if (err) reject(err);
            else {
              if (res?.[0].total === 0) {
                this.deleteKeywords(keyword.idKeyword);
              }
              resolve(res);
            }
          }
        );
      });
    });
  }
}
