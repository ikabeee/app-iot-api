import axios from 'axios';
import { SensorApi } from '../interfaces/SensorApi';
import { ParcelaApi } from '../interfaces/ParcelaApi';

const getSensors = async (): Promise<SensorApi> => {
        const response = await axios.get(`https://moriahmkt.com/iotapp/`);
        if(!response) {
                console.error(`Error unexpected`);
        }
        const sensorsData = response.data.sensores;
        return sensorsData;
}

const getAllPlots = async (): Promise<ParcelaApi[]> => {
        const response = await axios.get(`https://moriahmkt.com/iotapp/`);
        if(!response) {
                console.error(`Error unexpected`);
        }
        const plotsData = response.data.parcelas;
        return plotsData;
}

export { getAllPlots, getSensors }