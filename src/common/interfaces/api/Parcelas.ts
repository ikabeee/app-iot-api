import { Sensores } from "./Sensores";

export interface Parcelas {
    id: number;
    nombre: string;
    ubicacion: string;
    responsable: string;
    tipo_cultivo: string;
    ultimo_riego: string;
    sensor: Sensores;
    latitud: number;
    longitud: number;
}
