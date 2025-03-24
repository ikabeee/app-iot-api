import { Sensor } from "@prisma/client";
import { prisma } from "../../config/db";

export const getSensors = async(): Promise<Sensor[]> => {
    const sensors = await prisma.sensor.findMany();
    return sensors;
}
