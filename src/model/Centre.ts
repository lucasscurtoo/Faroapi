import { Career } from "./Career";
import { RowDataPacket } from "mysql2";

export class Centre {
  private idCentre: number;
  private centreName: string;
  private free: boolean;
  private adress: string;
  private latitude: number;
  private longitude: number;
  private centreSchedule: string;
  private phoneNumber: number;
  private careers: Career[];

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

  public getAdress(): string {
    return this.adress;
  }

  public setAdress(adress: string): void {
    this.adress = adress;
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

  public getCentreSchedule(): string {
    return this.centreSchedule;
  }

  public setCentreSchedule(centreSchedule: string): void {
    this.centreSchedule = centreSchedule;
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

  constructor(
    idCentre?: number,
    centreName?: string,
    free?: boolean,
    adress?: string,
    latitude?: number,
    longitude?: number,
    centreSchedule?: string,
    phoneNumber?: number,
    careers?: Career[]
  ) {
    this.idCentre = idCentre;
    this.centreName = centreName;
    this.free = free;
    this.adress = adress;
    this.latitude = latitude;
    this.longitude = longitude;
    this.centreSchedule = centreSchedule;
    this.phoneNumber = phoneNumber;
    this.careers = careers;
  }
}
export interface CentreDB extends RowDataPacket {
  idCentre?: number;
  centreName: string;
  free: boolean;
  adress: string;
  latitude: number;
  longitude: number;
  centreSchedule: string;
  phoneNumber: number;
}
