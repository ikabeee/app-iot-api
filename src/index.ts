import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { insertDataSensors } from './common/scripts/sensorApi';
import { havePlotBeenDeleted, insertPlotData, insertPlotSensorData } from './common/scripts/plotApi';

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors())

dotenv.config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server running on port: ${PORT}`);
    setInterval(async () => {
        await insertDataSensors();
    }, 1000);
    setInterval(async()=>{
        await havePlotBeenDeleted();
    }, 1000)
    setInterval(async()=>{
        await insertPlotData()
    }, 1000)
    setInterval(async()=>{
        await insertPlotSensorData()
    }, 1000)
});