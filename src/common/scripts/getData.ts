import axios from 'axios';
import { SensorApi } from '../interfaces/SensorApi';
import { ParcelaApi } from '../interfaces/ParcelaApi';

const getSensors = async (): Promise<SensorApi | undefined> => {
    try {
        const response = await axios.get(`https://moriahmkt.com/iotapp/`);
        const sensorsData = response.data.sensores;
        console.log(sensorsData);
        return sensorsData;
    } catch (error: unknown) {
        console.error(`Error fetching data ${error}`);
        return undefined;
    }
}

const getAllPlots = async (): Promise<ParcelaApi[] | undefined> => {
    try {
        const response = await axios.get(`https://moriahmkt.com/iotapp/`);
        const plotsData = response.data.parcelas;
        console.log(plotsData)
        return plotsData;
    } catch (error: unknown) {
        console.error(`Error fetching data ${error}`);
        return undefined;
    }
}

module.exports = {
    getAllPlots,
    getSensors
};