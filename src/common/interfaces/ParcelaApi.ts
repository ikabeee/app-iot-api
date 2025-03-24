import { SensorApi } from "./SensorApi";

export interface ParcelaApi {
 id:           number;
 latitud:      number;
 longitud:     number;
 nombre:       string;
 responsable:  string;
 sensor:       SensorApi;
 tipo_cultivo: string;
 ubicacion:    string;
 ultimo_riego: Date;
}