import { Response, Request } from "express";
import { getSensors } from "./sensor.service";

export const getSensorsController = async(_req: Request, res: Response): Promise<void> => {
    try{
        const sensors = await getSensors();
        res.status(200).json(sensors);
        return;
    }catch(error: unknown){
        res.status(500).json({ httpCode: 500, error: `Unexpected error ${error}`, timestamp: new Date() });
        return;
    }
}