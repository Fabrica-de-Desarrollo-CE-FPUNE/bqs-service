import { vista_info_consultor } from "../types/ConsultorEstudianteVistas.types";
import { IConsultorDataProvider } from "./Services.interfaces";

import { info_calificaciones, info_contacto, info_estudiante, info_extension, info_habilitacion_actual, info_horario_clase, 
    info_horario_docente, info_inscripciones_asistencia, info_libros_prestamo, info_libros_reservas, info_materia_pendiente,
     info_resultado_evaluacion_final, info_resultado_parcial, info_tiempo_rendimiento, info_ultimos_pagos } from "../types/ConsultorEstudiante.types";


import { ConsultorWebScraper } from "../bot/scraper/Consultor.WebScraper";
import { Alumno_credencial_login } from "../types/ConsultorEstudianteCredenciales.types";
import { ConsultorWebParser } from "../bot/parser/Consultor.WebParser";


export class ConsultorDataService implements IConsultorDataProvider{

    public async getAll_Consultor_Info(credencial: Alumno_credencial_login): Promise<vista_info_consultor> {
        const scraper = new ConsultorWebScraper(credencial);
        const consultor_pagina = await scraper.getConsultorData();
        const parser = new ConsultorWebParser(consultor_pagina);
        parser.parse();

        const info_estudiante_cabecera: info_estudiante = parser.get_info_estudiante();
        const info_estudiante_contacto: info_contacto = parser.get_info_contacto();
        const info_estudiante_rendimiento: info_tiempo_rendimiento = parser.get_info_tiempo_rendimiento();

        const info_estudiante_inscripciones: info_inscripciones_asistencia[] = parser.get_info_inscipciones_asistencia();
        const info_estudiante_pagos: info_ultimos_pagos[] = parser.get_info_ultimos_pagos();
        const info_estudiante_parciales: info_resultado_parcial[] = parser.get_info_resultados_parciales();
        const info_estudiante_habilitacion: info_habilitacion_actual[] = parser.get_info_habilitaciones_actuales();
        const info_estudiante_evaluacion_final: info_resultado_evaluacion_final[] = parser.get_info_resultados_evaluaciones_finales();
        const info_estudiante_calificaciones:info_calificaciones[] = parser.get_info_calificaciones();
        const info_estudiante_materia_pendiente: info_materia_pendiente[] = parser.get_info_materia_pendiente();
        const info_estudiante_extension: info_extension[] = parser.get_info_extension();
        const info_estudiante_horario_clase:info_horario_clase[] = parser.get_info_horario_clase();
        const info_estudiante_horario_docente: info_horario_docente[] = parser.get_info_horario_docente();
        const info_estudiante_libros_reservas: info_libros_reservas[] = parser.get_info_libros_reservas();
        const info_estudiante_libros_prestamos: info_libros_prestamo[] = parser.get_info_libros_prestamos();

        return {
            info_cabecera: info_estudiante_cabecera, 
            info_contacto: info_estudiante_contacto, 
            info_rendimiento: info_estudiante_rendimiento, 
            info_inscripciones: info_estudiante_inscripciones, 
            info_pagos: info_estudiante_pagos, 
            info_parciales: info_estudiante_parciales, 
            info_habilitaciones: info_estudiante_habilitacion, 
            info_finales: info_estudiante_evaluacion_final, 
            info_calificaciones: info_estudiante_calificaciones, 
            info_materias_pendientes: info_estudiante_materia_pendiente, 
            info_extensiones: info_estudiante_extension, 
            info_horario_clase: info_estudiante_horario_clase, 
            info_horario_docente: info_estudiante_horario_docente, 
            info_libros_reservas: info_estudiante_libros_reservas, 
            info_libros_prestamos: info_estudiante_libros_prestamos 

        }
        
    }

} 




