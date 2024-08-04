
import { info_estudiante, 
    info_contacto, 
    info_tiempo_rendimiento,
    info_inscripciones_asistencia, 
    info_ultimos_pagos, 
    info_resultado_parcial, 
    info_habilitacion_actual, 
    info_resultado_evaluacion_final, 
    info_calificaciones, 
    info_materia_pendiente, 
    info_extension, 
    info_horario_clase, 
    info_horario_docente, 
    info_libros_prestamo, 
    info_libros_reservas
 } from "../../types/ConsultorEstudiante.types";

export interface IBasicEstudianteInfoParser {
    get_info_estudiante():info_estudiante;
    get_info_contacto():info_contacto;
    get_info_tiempo_rendimiento():info_tiempo_rendimiento;
}
export interface IEstudianteInfoTableParser {
    get_info_inscipciones_asistencia(): info_inscripciones_asistencia[];
    get_info_ultimos_pagos():info_ultimos_pagos[];
    get_info_resultados_parciales(): info_resultado_parcial[];
    get_info_habilitaciones_actuales(): info_habilitacion_actual[];
    get_info_resultados_evaluaciones_finales(): info_resultado_evaluacion_final[];
    get_info_calificaciones(): info_calificaciones[];
    get_info_materia_pendiente(): info_materia_pendiente[];
    get_info_extension(): info_extension[];
    get_info_horario_clase(): info_horario_clase[];
    get_info_horario_docente(): info_horario_docente[];
    get_info_libros_reservas(): info_libros_reservas[];
    get_info_libros_prestamos(): info_libros_prestamo[];
}