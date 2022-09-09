import { RowDataPacket } from "mysql2";

export class Career {
  private id_career: number;
  private career_name: string;
  private career_description: string;
  private grade: string;
  private duration: string;
  private keywords: string[];

  constructor(
    id_career?: number,
    career_name?: string,
    career_description?: string,
    grade?: string,
    duration?: string,
    keywords?: string[]
  ) {
    this.id_career = id_career;
    this.career_name = career_name;
    this.career_description = career_description;
    this.grade = grade;
    this.duration = duration;
    this.keywords = keywords;
  }
  public getId_career(): number {
    return this.id_career;
  }

  public setId_career(id_career: number): void {
    this.id_career = id_career;
  }

  public getCareer_name(): string {
    return this.career_name;
  }

  public setCareer_name(career_name: string): void {
    this.career_name = career_name;
  }

  public getCareer_description(): string {
    return this.career_description;
  }

  public setCareer_description(career_description: string): void {
    this.career_description = career_description;
  }

  public getGrade(): string {
    return this.grade;
  }

  public setGrade(grade: string): void {
    this.grade = grade;
  }

  public getDuration(): string {
    return this.duration;
  }

  public setDuration(duration: string): void {
    this.duration = duration;
  }

  public getKeywords(): string[] {
    return this.keywords;
  }

  public setKeywords(keywords: string[]): void {
    this.keywords = keywords;
  }
}

export interface Career_db extends RowDataPacket {
  id_career?: number;
  career_name: string;
  career_description: string;
  grade: string;
  duration: string;
}

export interface keyword_db extends RowDataPacket {
  id_keyword: number;
  keyword: string;
}
