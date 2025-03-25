import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { insertDataSensors } from './common/scripts/sensorApi';
import { havePlotBeenDeleted, insertPlotData, insertPlotSensorData, updatePlotData } from './common/scripts/plotApi';
// Routes
import oauthRouter from './modules/auth/auth.routes';
import plotRouter from './modules/plot/plot.routes';
import userRouter from './modules/user/user.routes';
import sensorRouter from './modules/sensor/sensor.routes';
import historyRouter from './modules/historyPlot/historyPlot.routes';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { isAuthenticated } from './middlewares/auth';

const app = express();
dotenv.config();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use('/api', oauthRouter);

app.use('/api', isAuthenticated, plotRouter);
app.use('/api', isAuthenticated, sensorRouter);
app.use('/api', isAuthenticated, userRouter);
app.use('/api', isAuthenticated, historyRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server running on port: ${PORT}`);
    // setInterval(async () => {
    //     await insertDataSensors();
    // }, 1000);
    // setInterval(async()=>{
    //     await havePlotBeenDeleted();
    // }, 1000)
    // setInterval(async()=>{
    //     await insertPlotData()
    // }, 1000)
    // setInterval(async()=>{
    //     await updatePlotData()
    // }, 1000)
    // setInterval(async()=>{
    //     await insertPlotSensorData()
    // }, 1000)
});