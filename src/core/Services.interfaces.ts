import { Alumno_credencial_login } from "../types/ConsultorEstudianteCredenciales.types";
import { vista_info_consultor } from "../types/ConsultorEstudianteVistas.types";

export interface IConsultorDataProvider {
    getAll_Consultor_Info(credential: Alumno_credencial_login):Promise<vista_info_consultor>;
    //mas metodos singulares a ser agregados luego.
}