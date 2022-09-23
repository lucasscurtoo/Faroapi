import { OkPacket } from "mysql2";
import { db } from "../databaseCon/Database";
import { KeywordDB, selectCount } from "../model/Generics";

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
        "call DBFiller_Career_VinculateKeyword(?,?)",
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
        else {
          resolve(res);
        }
      });
    });
  }

  deleteKeyword(idKeyword: number): Promise<number> {
    return new Promise((resolve, reject) => {
      db.query<OkPacket>(
        "delete from KEYWORD where idKeyword=?",
        [idKeyword],
        (err, res) => {
          if (err) reject(err);
          else resolve(res?.affectedRows);
        }
      );
    });
  }

  clearKeywords(): Promise<selectCount[]> {
    return new Promise(async (resolve, reject) => {
      const keywords = await this.getKeywords();
      keywords.forEach((keyword) => {
        db.query<selectCount[]>(
          "select count(idCareer) as countResult from CAREER_KEYWORD where idKeyword=?",
          [keyword.idKeyword],
          async (err, res) => {
            if (err) reject(err);
            else {
              if (res?.[0].countResult == 0) {
                this.deleteKeyword(keyword.idKeyword);
              }
              resolve(res);
            }
          }
        );
      });
    });
  }
}
