import { RowDataPacket } from "mysql2";

export class Career {
  private id: number;
  private name: string;
  private description: string;
  private grade: string;
  private duration: string;
  private keywords: string[];

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getDescription(): string {
    return this.description;
  }

  public setDescription(description: string): void {
    this.description = description;
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
  career_description: boolean;
  grade: number;
  duration: number;
}
