import { RowDataPacket } from "mysql2";

export class Career {
  private idCareer: number;
  private careerName: string;
  private careerDescription: string;
  private degree: string;
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

  public getDegree(): string {
    return this.degree;
  }

  public setDegree(degree: string): void {
    this.degree = degree;
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
    degree?: string,
    duration?: string,
    keywords?: string[]
  ) {
    this.idCareer = idCareer;
    this.careerName = careerName;
    this.careerDescription = careerDescription;
    this.degree = degree;
    this.duration = duration;
    this.keywords = keywords;
  }
}

export interface CareerDB extends RowDataPacket {
  idCareer?: number;
  careerName: string;
  careerDescription: string;
  degree: string;
  duration: string;
}
