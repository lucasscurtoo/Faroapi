import { RowDataPacket } from "mysql2";

export interface KeywordDB extends RowDataPacket {
  idKeyword: number;
  keyword: string;
}

export interface selectCount extends RowDataPacket {
  countResult: number;
}
