import { Sensor } from "@prisma/client";
import { prisma } from "../../config/db"
import { getSensors } from "./getDataApi"

const insertDataSensors = async():Promise<Sensor> =>{
        const sensors = await getSensors();
        const newSensorLog = await prisma.sensor.create({ data:{
            sun: sensors.sol,
            rain: sensors.lluvia,
            humidity: sensors.humedad,
            temperature: sensors.temperatura,
            date: new Date(),
        }})
        return newSensorLog;
}
export {insertDataSensors}