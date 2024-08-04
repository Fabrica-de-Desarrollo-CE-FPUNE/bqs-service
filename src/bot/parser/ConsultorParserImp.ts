import { info_estudiante, info_contacto, info_tiempo_rendimiento, info_inscripciones_asistencia, info_ultimos_pagos, info_resultado_parcial, info_habilitacion_actual, info_resultado_evaluacion_final, info_calificaciones, info_materia_pendiente, info_extension, info_horario_clase, info_horario_docente, info_libros_reservas, info_libros_prestamo, info_extra } from "../../types/ConsultorInfoTipos/ConsultorEstudianteTipos";
import { IConsultorParserInterface, ITableContentPreProcessor, TableContent, TableContentObjects } from "./ConsultorParserInterfaces";
import cheerio, { CheerioAPI, Element } from 'cheerio';

export class ConsultorTableContentPreProcesor implements ITableContentPreProcessor{
    private $:CheerioAPI;
    constructor(htmlContent:string){
        this.$ = cheerio.load(htmlContent);
    }

    private extractConsultorTableContent(table: Element, tableIndex:number): TableContent{
        const headers: string[] = [];
        const rows: string[][] = [];

        this.$(table).find("tr").each((rowIndex, row) => {
            const cells: string[] = [];
            this.$(row).find("th, td").each((_, cell) => {
                cells.push(this.$(cell).text().trim());
            });
            if (rowIndex === 0) {
              headers.push(...cells);
            } else {
              rows.push(cells);
            }
          });
          return { headers, rows };

    }
    public get_TableConsultorObjects(): TableContentObjects {
        const tablesobjs: TableContentObjects = {};
        this.$('table').each((index, table) => {
            const tableContent = this.extractConsultorTableContent(table, index);
            tablesobjs[`table${index + 1}`] = tableContent;
        });
        return tablesobjs;
    }

}
export class ConsultoParserImp implements IConsultorParserInterface{
    private $:CheerioAPI;
    public constructor(htmlinput:string){
        this.$ = cheerio.load(htmlinput);
    }

    get_info_estudiante(): info_estudiante {
        const h3Text = this.$('div.col-sm-7 > h3').text();
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
      const correo = this.$('label[for="datos_email"]')
        .parent()
        .next()
        .text()
        .trim();
      const tel = this.$('label[for="datos_telefono"]')
        .parent()
        .next()
        .text()
        .trim();
      const cel = this.$('label[for="datos_celular"]')
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
        const Pcarrera = this.$('td:contains("Carrera...:")').next().text().trim();
        const PfechaIngreso = this.$('td:contains("Fecha de Ingreso...:")').next().text().trim();
        const PfechaEgreso = this.$('td:contains("Fecha Estimada de Egreso...:")').next().text().trim();
        const Ppromedio = this.$('td:contains("Promedio...:")').next().text().trim();
        const PmateriasAprobadas = this.$('td:contains("Total Materias Aprobadas...:")').next().text().trim();
        const PmateriasReprobadas = this.$('td:contains("Total Materias Reprobadas...:")').next().text().trim();
        const PporcentajeReprobadas = this.$('td:contains("Porcentaje Materias Reprobadas...:")').next().text().trim();
        const PbeneficiarioLey = this.$('td:contains("Beneficiario/a de la ley 6628/2020")').text().trim();
        const Pfoto = this.$('img[NAME="tiimagen"]').attr('src') as string;

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

    private extractInfoAsistenciasRow(tr: Element):info_inscripciones_asistencia {
        const tds = this.$(tr).find('td');
        return {
            materia: this.$(tds[0]).text().trim(),
            fecha_inscripto: this.$(tds[1]).text().trim(),
            validez: this.$(tds[2]).text().trim(),
            grupo: this.$(tds[3]).text().trim(),
            porc_asistencias: this.$(tds[4]).text().trim()
        };
    }
    get_info_inscipciones_asistencia(): info_inscripciones_asistencia[] {
        const info_asistencias: info_inscripciones_asistencia[] = [];

        this.$('table.table-condensed.table-striped tr').each((index, tr) => {
            if (index > 0) {
                info_asistencias.push(this.extractInfoAsistenciasRow(tr));
            }
        });
        return info_asistencias;

    }
    get_info_ultimos_pagos(): info_ultimos_pagos[] {

        const info_pagos: info_ultimos_pagos[] = [];

        
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
    get_info_extra(): info_extra {
        throw new Error("Method not implemented.");
    }

}





