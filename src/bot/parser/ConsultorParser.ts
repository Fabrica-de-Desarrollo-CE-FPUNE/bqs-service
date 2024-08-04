import cheerio, { CheerioAPI } from "cheerio";
import { info_estudiante, info_contacto, info_tiempo_rendimiento, info_calificaciones, info_extension, info_habilitacion_actual, info_horario_clase, info_horario_docente, info_inscripciones_asistencia, info_libros_prestamo, info_libros_reservas, info_materia_pendiente, info_resultado_evaluacion_final, info_resultado_parcial, info_ultimos_pagos } from "../../types/ConsultorEstudiante.types";
import { IBasicEstudianteInfoParser, IEstudianteInfoTableParser } from "./Parser.interfaces";


export class ConsultorBasicEstudianteInfoParser implements IBasicEstudianteInfoParser{
    private selector: CheerioAPI;

    public constructor(htmlinput: string){
        this.selector = cheerio.load(htmlinput);
    }
    get_info_estudiante(): info_estudiante {
        const h3Text = this.selector('div.col-sm-7 > h3').text();
        // todo: transformar el texto en sus partes individuales: cedula,nombre, apellido
        let result:info_estudiante = {
            nombre:'*', 
            apellido: '*', 
            cedula: '*',
            cedula_nombre_apellido: h3Text
        }   
        return result;
    }
    get_info_contacto(): info_contacto {
        const correo = this.selector('label[for="datos_email"]')
        .parent()
        .next()
        .text()
        .trim();
      const tel = this.selector('label[for="datos_telefono"]')
        .parent()
        .next()
        .text()
        .trim();
      const cel = this.selector('label[for="datos_celular"]')
        .parent()
        .next()
        .text()
        .trim();

        let result:info_contacto = {
            email: correo,
            telefono_particular:tel,
            celular:cel 
        }
        return result;
    }
    get_info_tiempo_rendimiento(): info_tiempo_rendimiento {
        const Pcarrera = this.selector('td:contains("Carrera...:")').next().text().trim();
        const PfechaIngreso = this.selector('td:contains("Fecha de Ingreso...:")').next().text().trim();
        const PfechaEgreso = this.selector('td:contains("Fecha Estimada de Egreso...:")').next().text().trim();
        const Ppromedio = this.selector('td:contains("Promedio...:")').next().text().trim();
        const PmateriasAprobadas = this.selector('td:contains("Total Materias Aprobadas...:")').next().text().trim();
        const PmateriasReprobadas = this.selector('td:contains("Total Materias Reprobadas...:")').next().text().trim();
        const PporcentajeReprobadas = this.selector('td:contains("Porcentaje Materias Reprobadas...:")').next().text().trim();
        const PbeneficiarioLey = this.selector('td:contains("Beneficiario/a de la ley 6628/2020")').text().trim();
        const Pfoto = this.selector('img[NAME="tiimagen"]').attr('src') as string;

        let result: info_tiempo_rendimiento = {
           carrera:Pcarrera, 
           fecha_ingreso:PfechaIngreso, 
           fecha_estimada_egreso: PfechaEgreso, 
           promedio: Ppromedio, 
           total_materias_aprobada: PmateriasAprobadas, 
           total_materias_reprobadas: PmateriasReprobadas, 
           porcentaje_materias_reprobadas: PporcentajeReprobadas, 
           status_arancel_cero: PbeneficiarioLey, 
           foto_estudiante: Pfoto
        }
        return result;
    }
}

export class ConsultorTableEstudianteTableInfoParser implements IEstudianteInfoTableParser {

    get_info_inscipciones_asistencia(): info_inscripciones_asistencia[] {
        throw new Error("Method not implemented.");
    }
    get_info_ultimos_pagos(): info_ultimos_pagos[] {
        throw new Error("Method not implemented.");
    }
    get_info_resultados_parciales(): info_resultado_parcial[] {
        throw new Error("Method not implemented.");
    }
    get_info_habilitaciones_actuales(): info_habilitacion_actual[] {
        throw new Error("Method not implemented.");
    }
    get_info_resultados_evaluaciones_finales(): info_resultado_evaluacion_final[] {
        throw new Error("Method not implemented.");
    }
    get_info_calificaciones(): info_calificaciones[] {
        throw new Error("Method not implemented.");
    }
    get_info_materia_pendiente(): info_materia_pendiente[] {
        throw new Error("Method not implemented.");
    }
    get_info_extension(): info_extension[] {
        throw new Error("Method not implemented.");
    }
    get_info_horario_clase(): info_horario_clase[] {
        throw new Error("Method not implemented.");
    }
    get_info_horario_docente(): info_horario_docente[] {
        throw new Error("Method not implemented.");
    }
    get_info_libros_reservas(): info_libros_reservas[] {
        throw new Error("Method not implemented.");
    }
    get_info_libros_prestamos(): info_libros_prestamo[] {
        throw new Error("Method not implemented.");
    }




}