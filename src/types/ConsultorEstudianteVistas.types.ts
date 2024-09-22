import {info_calificaciones, info_contacto, info_estudiante, info_extension, info_habilitacion_actual, info_horario_clase, info_horario_docente, info_inscripciones_asistencia, info_libros_prestamo, info_libros_reservas, info_materia_pendiente, info_resultado_evaluacion_final, info_resultado_parcial, info_tiempo_rendimiento, info_ultimos_pagos} from './ConsultorEstudiante.types';

export interface vista_info_consultor {
    info_cabecera:info_estudiante, 
    info_contacto : info_contacto, 
    info_rendimiento: info_tiempo_rendimiento,
    info_inscripciones: info_inscripciones_asistencia[], 
    info_pagos: info_ultimos_pagos[], 
    info_parciales: info_resultado_parcial[], 
    info_habilitaciones: info_habilitacion_actual[], 
    info_finales: info_resultado_evaluacion_final[], 
    info_calificaciones: info_calificaciones[], 
    info_materias_pendientes: info_materia_pendiente[], 
    info_extensiones: info_extension[], 
    info_horario_clase: info_horario_clase[], 
    info_horario_docente: info_horario_docente[], 
    info_libros_reservas: info_libros_reservas[], 
    info_libros_prestamos: info_libros_prestamo[]
}