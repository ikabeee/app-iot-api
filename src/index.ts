import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { insertDataSensors } from './common/scripts/sensorApi';
import { havePlotBeenDeleted, insertPlotData, insertPlotSensorData, updatePlotData } from './common/scripts/plotApi';
// Routes
import plotRouter from './modules/plot/plot.routes';
import userRouter from './modules/user/user.routes';
import sensorRouter from './modules/sensor/sensor.routes';
import historyRouter from './modules/historyPlot/historyPlot.routes';

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors())
dotenv.config();

app.use('/api', plotRouter);
app.use('/api', sensorRouter);
app.use('/api', userRouter);
app.use('/api', historyRouter);

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
        await updatePlotData()
    }, 1000)
    setInterval(async()=>{
        await insertPlotSensorData()
    }, 1000)
});