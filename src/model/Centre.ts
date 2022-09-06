import { Career } from "./Career";
import { RowDataPacket } from "mysql2";

export class Centre {
  private id_centre: number;
  private centre_name: string;
  private free: boolean;
  private latitude: number;
  private longitude: number;
  private centre_schedule: string;
  private phoneNumber: number;
  private careers: Career[];

  constructor(
    id_centre?: number,
    centre_name?: string,
    free?: boolean,
    latitude?: number,
    longitude?: number,
    centre_schedule?: string,
    phoneNumber?: number,
    careers?: Career[]
  ) {
    this.id_centre = id_centre;
    this.centre_name = centre_name;
    this.free = free;
    this.latitude = latitude;
    this.longitude = longitude;
    this.centre_schedule = centre_schedule;
    this.phoneNumber = phoneNumber;
    this.careers = careers;
  }

  public getId_centre(): number {
    return this.id_centre;
  }

  public setId_centre(id_centre: number): void {
    this.id_centre = id_centre;
  }

  public getCentre_name(): string {
    return this.centre_name;
  }

  public setCentre_name(centre_name: string): void {
    this.centre_name = centre_name;
  }

  public isFree(): boolean {
    return this.free;
  }

  public setFree(free: boolean): void {
    this.free = free;
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

  public getCentre_schedule(): string {
    return this.centre_schedule;
  }

  public setCentre_schedule(centre_schedule: string): void {
    this.centre_schedule = centre_schedule;
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
export interface Centre_db extends RowDataPacket {
  id_centre?: number;
  centre_name: string;
  free: boolean;
  latitude: number;
  longitude: number;
  centre_schedule: string;
  phoneNumber: number;
}
