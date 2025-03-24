import { Sensor } from "@prisma/client";
import { prisma } from "../../config/db"
import { getSensors } from "./getData"

const insertSensors = async():Promise<Sensor | undefined> =>{
    try{
        const sensors = await getSensors();
        const newSensorLog = await prisma.sensor.create({ data:{
            sun: sensors?.sol ?? 0,
            rain: sensors?.lluvia ?? 0,
            humidity: sensors?.humedad ?? 0,
            temperature: sensors?.temperatura ?? 0,
            date: new Date(),
        }})
        console.log(await prisma.sensor.findMany())
        return newSensorLog;
    }catch(error: unknown){
        console.error(`Error inserting data ${error}`);
        return undefined;
    }
}

insertSensors();