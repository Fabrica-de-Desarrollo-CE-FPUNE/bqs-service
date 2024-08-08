export interface info_estudiante{
    nombre:string, 
    apellido:string, 
    cedula:string, 
    cedula_nombre_apellido:string
}

export interface info_contacto{
    email:string, 
    telefono_particular:string, 
    celular:string
}

export interface info_tiempo_rendimiento{
    carrera:string, 
    fecha_ingreso:string,
    fecha_estimada_egreso:string, 
    promedio:string, 
    total_materias_aprobada:string,
    total_materias_reprobadas:string, 
    porcentaje_materias_reprobadas:string, 
    status_arancel_cero:string,
    foto_estudiante:string
}

export interface info_inscripciones_asistencia {
    materia:string,
    fecha_inscripto:string, 
    validez:string, 
    grupo:string,
    porc_asistencias:string
}

export interface info_ultimos_pagos {
    arancel:string, 
    vencimiento:string, 
    fecha_pago:string,
    importe:string,
    situacion:string
}
export interface info_resultado_parcial{
    materia:string, 
    primera_parcial:string, 
    segunda_parcial:string, 
    trabajo_practico:string, 
    trabajo_laboratorio:string, 
    evaluacion:string
}

export interface info_habilitacion_actual{
     materia:string, 
     bonificacion:string, 
     vencimiento:string,
     periodo:string
}

export interface info_resultado_evaluacion_final{
    materia:string, 
    fecha:string, 
    final:string, 
    bonificacion:string,
    total:string,
    nota:string
}

export interface info_calificaciones {
    materia:string, 
    semestre:string, 
    fecha:string, 
    nota:string, 
    acta:string
}

export interface info_materia_pendiente{
    materia:string, 
    semestre:string, 
    correlatividad:string
}
export interface info_extension {
    carrera:string,
    actividad:string, 
    tipo_actividad:string, 
    maxima:string, 
    cantidad:string, 
    horas:string
}

export interface info_horario_clase{
    carrera:string, 
    materia:string, 
    grupo:string, 
    dia:string, 
    horario:string, 
    programa_estudio:string
}
export interface info_horario_docente{
    carrera:string, 
    materia:string, 
    grupo:string, 
    dia:string, 
    horario:string, 
    programa_estudio:string
}
export interface info_libros_reservas {
    libro:string, 
    reserva:string, 
    disponible:string, 
    estado:string
}
export interface info_libros_prestamo {
    libro:string, 
    prestamo:string, 
    devolver:string, 
    estado:string
}



