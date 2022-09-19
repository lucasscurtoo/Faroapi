import { Career } from "./Career";
import { RowDataPacket } from "mysql2";

export class Centre {
  private idCentre: number;
  private centreName: string;
  private free: boolean;
  private addressStreet: string;
  private addressNumber: number;
  private latitude: number;
  private longitude: number;
  private centreSchedule: string[];
  private schoolarLevel: string;
  private phoneNumber: number;
  private careers: Career[];

  constructor(
    idCentre?: number,
    centreName?: string,
    free?: boolean,
    addressStreet?: string,
    addressNumber?: number,
    latitude?: number,
    longitude?: number,
    centreSchedule?: string[],
    schoolarLevel?: string,
    phoneNumber?: number,
    careers?: Career[]
  ) {
    this.idCentre = idCentre;
    this.centreName = centreName;
    this.free = free;
    this.addressStreet = addressStreet;
    this.addressNumber = addressNumber;
    this.latitude = latitude;
    this.longitude = longitude;
    this.centreSchedule = centreSchedule;
    this.schoolarLevel = schoolarLevel;
    this.phoneNumber = phoneNumber;
    this.careers = careers;
  }

  public getIdCentre(): number {
    return this.idCentre;
  }

  public setIdCentre(idCentre: number): void {
    this.idCentre = idCentre;
  }

  public getCentreName(): string {
    return this.centreName;
  }

  public setCentreName(centreName: string): void {
    this.centreName = centreName;
  }

  public isFree(): boolean {
    return this.free;
  }

  public setFree(free: boolean): void {
    this.free = free;
  }

  public getAddressStreet(): string {
    return this.addressStreet;
  }

  public setAddressStreet(addressStreet: string): void {
    this.addressStreet = addressStreet;
  }

  public getAddressNumber(): number {
    return this.addressNumber;
  }

  public setAddressNumber(addressNumber: number): void {
    this.addressNumber = addressNumber;
  }

  public getLatitude(): number {
    return this.latitude;
  }

  public setLatitude(latitude: number): void {
    this.latitude = latitude;
  }

  public getLongitude(): number {
    return this.longitude;
  }

  public setLongitude(longitude: number): void {
    this.longitude = longitude;
  }

  public getCentreSchedule(): string[] {
    return this.centreSchedule;
  }

  public setCentreSchedule(centreSchedule: string[]): void {
    this.centreSchedule = centreSchedule;
  }

  public getSchoolarLevel(): string {
    return this.schoolarLevel;
  }

  public setSchoolarLevel(schoolarLevel: string): void {
    this.schoolarLevel = schoolarLevel;
  }

  public getPhoneNumber(): number {
    return this.phoneNumber;
  }

  public setPhoneNumber(phoneNumber: number): void {
    this.phoneNumber = phoneNumber;
  }

  public getCareers(): Career[] {
    return this.careers;
  }

  public setCareers(careers: Career[]): void {
    this.careers = careers;
  }
}

export interface CentreScheduleDB extends RowDataPacket {
  centreSchedule: string;
}

export interface schoolarLevelDB extends RowDataPacket {
  schoolarLevel: string;
}

export interface CentreDB extends RowDataPacket {
  idCentre?: number;
  centreName: string;
  free: boolean;
  adressStreet: string;
  adressNumber: number;
  idSchoolarLevel: number;
  latitude: number;
  longitude: number;
  phoneNumber: number;
}
