import { vista_info_consultor } from "../types/ConsultorEstudianteVistas.types";

export interface IConsultorService {
    getAll_Consultor_Info():Promise<vista_info_consultor>;
    //mas metodos a ser agregado luego
}
