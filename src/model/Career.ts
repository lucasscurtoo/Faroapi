import { RowDataPacket } from "mysql2";

export class Career {
  private idCareer: number;
  private careerName: string;
  private careerDescription: string;
  private grade: string;
  private duration: string;
  private keywords: string[];

  public getIdCareer(): number {
    return this.idCareer;
  }

  public setIdCareer(idCareer: number): void {
    this.idCareer = idCareer;
  }

  public getCareerName(): string {
    return this.careerName;
  }

  public setCareerName(careerName: string): void {
    this.careerName = careerName;
  }

  public getCareerDescription(): string {
    return this.careerDescription;
  }

  public setCareerDescription(careerDescription: string): void {
    this.careerDescription = careerDescription;
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

  constructor(
    idCareer?: number,
    careerName?: string,
    careerDescription?: string,
    grade?: string,
    duration?: string,
    keywords?: string[]
  ) {
    this.idCareer = idCareer;
    this.careerName = careerName;
    this.careerDescription = careerDescription;
    this.grade = grade;
    this.duration = duration;
    this.keywords = keywords;
  }
}

export interface CareerDB extends RowDataPacket {
  idCareer?: number;
  careerName: string;
  careerDescription: string;
  grade: string;
  duration: string;
}

export interface KeywordDB extends RowDataPacket {
  idKeyword: number;
  keyword: string;
}
