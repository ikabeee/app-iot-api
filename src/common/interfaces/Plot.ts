import { Status } from "../enums/Status";

export interface Plot {
    id: number;
    name: string;
    location: string;
    manager: string;
    cropType: string;
    lastWatering: Date;
    lat: number;
    lng: number;
    status: Status;
    userId?: number;
}