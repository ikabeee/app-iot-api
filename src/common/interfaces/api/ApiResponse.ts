import { Parcelas } from "./Parcelas";
import { Sensores } from "./Sensores";

export interface ApiResponse {
    sensores: Sensores;
    parcelas: Parcelas[];
}
