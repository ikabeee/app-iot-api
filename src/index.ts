import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

// Routes
import oauthRouter from './modules/auth/auth.routes';
import plotRouter from './modules/plot/plot.routes';
import userRouter from './modules/user/user.routes';
import sensorRouter from './modules/sensor/sensor.routes';
import historyRouter from './modules/historyPlot/historyPlot.routes';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { auth } from './middlewares/auth';
import { checkPlotStatus, insertPlotData, insertPlotSensorData, updatePlotData } from './common/scripts/insertData';
import { insertDataSensors } from './common/scripts/sensorApi';

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
};


const app = express();
dotenv.config();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(cookieParser());


app.use((req, _res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session Data:', req.session);
    next();
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, 
        secure: false,  
        maxAge: 24 * 60 * 60 * 1000
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

    setInterval(async () => {
        try {
            await updatePlotData();
        } catch (error) {
            console.error('Error en el intervalo de actualización de parcelas:', error);
        }
    }, 10000);

    setInterval(async () => {
        try {
            await insertPlotData();
        } catch (error) {
            console.error('Error en el intervalo de inserción de parcelas:', error);
        }
    }, 10000);

    setInterval(async () => {
        try {
            await checkPlotStatus();
        } catch (error) {
            console.error('Error en el intervalo de verificación de parcelas eliminadas:', error);
        }
    }, 10000);

    setInterval(async () => {
        try {
            await insertDataSensors();
        } catch (error) {
            console.error('Error en el intervalo de inserción de datos de sensores:', error);
        }
    }, 1000);
});