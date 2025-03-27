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
import { auth } from './middlewares/auth';

const corsOptions = {
    origin: 'http://localhost:5173',  // Asegúrate de que este es el dominio correcto de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,  // Esto es lo más importante: permite que se envíen cookies
};


const app = express();
dotenv.config();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(cookieParser());
// app.use(auth);

app.use((req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session Data:', req.session);
    next();
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,  // Esto es para mayor seguridad
        secure: false,  // Asegúrate de que esté desactivado en desarrollo
        maxAge: 24 * 60 * 60 * 1000  // Duración de la cookie (1 día)
    }
}));


app.use('/api', oauthRouter);
app.use('/api', plotRouter);
app.use('/api', sensorRouter);
app.use('/api', userRouter);
app.use('/api', historyRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
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