import { ApiResponse } from "../interfaces/api/ApiResponse";
import axios from 'axios';
import { Sensores } from "../interfaces/api/Sensores";
import { Parcelas } from "../interfaces/api/Parcelas";

const getData = async(): Promise<ApiResponse> => {
    const response = await axios.get('https://moriahmkt.com/iotapp/test/');
    return response.data as ApiResponse;
}

const getSensors = async(): Promise<Sensores> => {
    const data = await getData();
    return data.sensores as Sensores;
}

const getParcelas = async(): Promise<Parcelas[]> => {
    const data = await getData();
    return data.parcelas as Parcelas[];
}


export { getSensors, getParcelas };