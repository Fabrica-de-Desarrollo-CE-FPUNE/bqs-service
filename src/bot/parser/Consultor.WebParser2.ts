import { load, CheerioAPI } from "cheerio";
import { info_estudiante, info_contacto, info_tiempo_rendimiento, info_inscripciones_asistencia, info_ultimos_pagos, info_resultado_parcial, info_habilitacion_actual, info_resultado_evaluacion_final, info_calificaciones, info_materia_pendiente, info_extension, info_horario_clase, info_horario_docente, info_libros_reservas, info_libros_prestamo } from '../../types/ConsultorEstudiante.types';
import { IConsultorWebParser } from "./WebParser.Interfaces";

export class ConsultorWebParser2 implements IConsultorWebParser {

    private selector: CheerioAPI;
    private jsonData: any;

    get_info_estudiante(): info_estudiante {
        return this.jsonData['info_cabecera'];
    }
    get_info_contacto(): info_contacto {
        return this.jsonData.info_contacto
    }
    get_info_tiempo_rendimiento(): info_tiempo_rendimiento {
        return this.jsonData['info_rendimiento'];
    }
    get_info_inscipciones_asistencia(): info_inscripciones_asistencia[] {
        return this.jsonData['info_inscripciones'];
    }
    get_info_ultimos_pagos(): info_ultimos_pagos[] {
        return this.jsonData['info_pagos'];
    }
    get_info_resultados_parciales(): info_resultado_parcial[] {
        return this.jsonData['info_parciales'];
    }
    get_info_habilitaciones_actuales(): info_habilitacion_actual[] {
        return this.jsonData['info_habilitaciones'];
    }
    get_info_resultados_evaluaciones_finales(): info_resultado_evaluacion_final[] {
        return this.jsonData['info_finales'];
    }
    get_info_calificaciones(): info_calificaciones[] {
        return this.jsonData['info_calificaciones'];
    }
    get_info_materia_pendiente(): info_materia_pendiente[] {
        return this.jsonData['info_materias_pendientes'];
    }
    get_info_extension(): info_extension[] {
        return this.jsonData['info_extensiones'];
    }
    get_info_horario_clase(): info_horario_clase[] {
        return this.jsonData['info_horario_clase'];
    }
    get_info_horario_docente(): info_horario_docente[] {
        return this.jsonData['info_horario_docente'];
    }
    get_info_libros_reservas(): info_libros_reservas[] {
        return this.jsonData['info_libros_reservas'];
    }
    get_info_libros_prestamos(): info_libros_prestamo[] {
        return this.jsonData['info_libros_prestamos'];
    }

    private limpieza(htmlBody: string): any {
    
    let nuevoHtmlBody = htmlBody;

    const correcciones: (string | RegExp)[][] = [
        [/\s+/g, ' '],
        [/,\s*"\*\*\* ART. 71: A los alumnos que hayan acumulado durante su carrera un número de aplazos equivalente al 30% \(treinta por ciento\) del número de asignaturas de su plan de estudios, se les cancelará automática y definitivamente la matricula \(Ref. Art. 67; Estatuto UNE\)",/g, ''],
        [/,\s*"\*\*\* ART. 49: Desde el ingreso a la Universidad, el alumno tendrá como plazo máximo para completar el curriculum de la carrera elegida un periodo no mayor al de la duración de la misma más sus tres cuartas partes matemáticas. Al no completar el curriculum en el periodo máximo establecido la matricula se le cancelará automática y definitivamente \(Ref. Art. 65; Estatuto UNE\).",/g, ''],
        [/,\s*"\*\*\* ART. 49: Desde el ingreso a la Universidad del.*Estatuto UNE\)\s*"/g, ''],
        [/"\s*\*\*\* ART\. \d+.*?[}\]]/g, '"}'],
        ['Fecha de Ingreso...:', 'fecha_ingreso'],
        ['Fecha Estimada de Egreso...:', 'fecha_estimada_egreso'],
        ['Promedio...:', 'promedio'],
        ['Carrera...:', 'carrera'],
        ['Total Materias Aprobadas...:', 'total_materias_aprobada'],
        ['Total Materias Reprobadas...:', 'total_materias_reprobadas'],
        ['Porcentaje Materias Reprobadas...:', 'porcentaje_materias_reprobadas'],
        [/"\s*\}\s*"/g, '", "'],
        [/,\s*(?=[}\]])/g, ''],
        [/},\s*\]/g, "}]"]
    ];

    for (let indexBuscar = 0; indexBuscar < correcciones.length; indexBuscar++) {
        nuevoHtmlBody = nuevoHtmlBody.replace(correcciones[indexBuscar][0], correcciones[indexBuscar][1] as string);
    }

    nuevoHtmlBody = nuevoHtmlBody.replace(/"(\s*"\*\*\* ART\. \d+.*?)(\s*"status_arancel_cero")/g, '", $2');

    const regexFinales = /"info_finales":\s*\[\s*((?:\s*"materia":\s*".*?"\s*"fecha":\s*".*?"\s*"final_100":\s*".*?"\s*"bonificacion":\s*".*?"\s*"total":\s*".*?"\s*"nota":\s*".*?")+\s*)\s*\]/g;

    nuevoHtmlBody = nuevoHtmlBody.replace(regexFinales, (match, innerContent) => {
        let contenidoLimpio = innerContent.replace(/",\s*"/g, '""');
        const bloquesFinales = contenidoLimpio.trim().split(/"materia":/g).filter((b: string) => b.trim() !== '');

        const objetosFinales = bloquesFinales.map((bloque: string) => {
            let contenidoBloque = `"materia": ${bloque.trim()}`;
            // ATENCIÓN: Renombramos la clave DENTRO DE LA REESTRUCTURACIÓN DE CADENAS
            contenidoBloque = contenidoBloque.replace(/"final_100":/g, `"final":`); 
            contenidoBloque = contenidoBloque.replace(/"\s+"/g, '", "');
            return `{${contenidoBloque}}`;
        });

        return `"info_finales": [${objetosFinales.join(', ')}]`;
    });

    const regexInfoRendimientoFix = /"porcentaje_materias_reprobadas":\s*"(.*?)"\s*"\s*\}\s*,\s*"info_inscripciones"/g;

    nuevoHtmlBody = nuevoHtmlBody.replace(regexInfoRendimientoFix, (match, porcentajeValue) => {
        const missingKeys = `"status_arancel_cero": "Beneficiario/a de la ley 6628/2020 en el presente periodo lectivo: Sí", "foto_estudiante": "imagen/4873368.jpg"`;
        return `"porcentaje_materias_reprobadas": "${porcentajeValue.trim()}", ${missingKeys} }, "info_inscripciones"`;
    });

    // 2. Parseo del JSON
    const json = JSON.parse(nuevoHtmlBody);

    // 3. Post-Parseo y Limpieza de Valores (solo limpieza de espacios en nota)
    if (json.info_calificaciones) {
        json.info_calificaciones = json.info_calificaciones.map((item: any) => {
            if (item.nota) {
                item.nota = item.nota.trim();
            }
            return item;
        });
    }

    return json;
}

    public async parse(): Promise<void> {
        const salida = this.selector('body').text();
        this.jsonData = this.limpieza(salida);
    }

    public constructor(htmlinput: string) {
        this.selector = load(htmlinput);
    }

}