

import * as fs from 'fs';
import { ConsultorTableProcessor } from './../src/bot/processors/ConsultorTableProcessor';
import { TableContentObjects } from '../src/bot/processors/processors.types';
import { ConsultorBasicEstudianteInfoParser, ConsultorTableEstudianteTableInfoParser } from './../src/bot/parser/ConsultorParser';
import { info_inscripciones_asistencia } from '../src/types/ConsultorEstudiante.types';
function readFile(filePath: string): string {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return content;
    } catch (err) {
        console.error(`Error reading file from path ${filePath}:`, err);
        return '';
    }
}
function writefile(filepath:string, content:string){
    try{
        fs.writeFileSync(filepath, content);
    }catch(err){
        console.log(err);
    }
}

const resources = "../bqs-service/test_resources/";

describe("ConsultorPreProcesor", () => {
    it("parsear el html y extraer los datos y comparar con los resultados esperados en forma bruta(sin procesado)", async () => {
        const stringcontent = readFile(resources+"consultor_data.html");
        let processor: ConsultorTableProcessor = new ConsultorTableProcessor(stringcontent);
        let parser : ConsultorBasicEstudianteInfoParser = new ConsultorBasicEstudianteInfoParser(stringcontent);
        const result: TableContentObjects = await processor.process();
       const expected_result = JSON.parse(readFile(resources+"consultor_raw_data_test.json"));
        const jsonO ={
            InfoEstudiante: {
                info_estudiante: parser.get_info_estudiante(), 
                info_contacto: parser.get_info_contacto(), 
                info_tiempo_rendimiento: parser.get_info_tiempo_rendimiento()
            },
            tablas: result
        } ;
       expect(jsonO).toStrictEqual(expected_result);

    });

    it("debe devolver la asistencias", async ()=>{

        const stringcontent = readFile(resources+"consultor_data.html");
        let processor: ConsultorTableProcessor = new ConsultorTableProcessor(stringcontent);
        const result: TableContentObjects = await processor.process();
        const consultotableparser: ConsultorTableEstudianteTableInfoParser = new ConsultorTableEstudianteTableInfoParser(result);
        consultotableparser.parse();
        const estudiante_info_inscripciones:info_inscripciones_asistencia[] = consultotableparser.get_info_inscipciones_asistencia();
        const resultObj =  {
            inscripciones: estudiante_info_inscripciones
        }
        const expected_result = JSON.parse(readFile(resources+"consultor_asistencias_test.json"));
        expect(resultObj).toStrictEqual(expected_result);
    });

    it("debe validar todos los metodos", async ()=>{

        const html_data = readFile(resources+"consultor_data.html");
        let parser = new ConsultorTableEstudianteTableInfoParser(await new ConsultorTableProcessor(html_data).process());
        parser.parse();

        const result = {
            estudiante_inscripciones : parser.get_info_inscipciones_asistencia(),
             estudiante_ultimos_pagos :  parser.get_info_ultimos_pagos(),
             estudiante_resultado_parciales : parser.get_info_resultados_parciales(),
             estudiante_habilitaciones : parser.get_info_habilitaciones_actuales(),
             estudiante_finales : parser.get_info_resultados_evaluaciones_finales(),
             estudiante_calificaciones : parser.get_info_calificaciones(),
             estudiante_materia_pendientes : parser.get_info_materia_pendiente(),
             estudiante_extension : parser.get_info_extension(),
             estudiante_horario_clase : parser.get_info_horario_clase(),
             estudiante_horario_docente : parser.get_info_horario_docente(),
             estudiante_libros_reservas : parser.get_info_libros_reservas(),
             estudiante_libros_prestamos : parser.get_info_libros_prestamos(),
        }
        const expected_result = JSON.parse(readFile(resources+"consultor_resultado_todo_json.json"));
        expect(result).toEqual(expected_result);
    });

  });
