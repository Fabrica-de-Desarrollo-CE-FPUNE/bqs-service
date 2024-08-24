
import { IConsultorWebParser } from '../../src/bot/parser/WebParser.Interfaces';
import { ConsultorWebParser } from '../../src/bot/parser/Consultor.WebParser';
import * as utils from './testutils';


let parser: IConsultorWebParser;
let resources:string = "tests/resources/";
describe("Tests del webparser del consultor", ()=> {

    beforeEach(()=>{
        const html: string = utils.read_File(`${resources}/consultor_data_html.txt`);
        parser = new ConsultorWebParser(html);
    });
    it("Debe parsear la informacion de la cabecera.", async ()=>{
        await parser.parse();
        let cabecera = {
            info_: parser.get_info_estudiante(), 
            info_contacto: parser.get_info_contacto(), 
            info_rendimiento: parser.get_info_tiempo_rendimiento()
        }
        let cabecera_esperada = utils.parse_json(`${resources}/cabecera_info_estudiante.json`);
        expect(cabecera).toEqual(cabecera_esperada);
    });

    it("Debe parsear la informacion de las asitencias", async ()=>{

        await parser.parse();
        let asistencias = {
            info_asistencia: parser.get_info_inscipciones_asistencia()
        }
        let asistencias_esperada = utils.parse_json(`${resources}/asistencias_info_estudiante.json`);
        expect(asistencias).toEqual(asistencias_esperada);

    });

    it("Debe parsear la informacion de ultimos pagos", async ()=>{
        // todo: obtener info de ejemplo para la seccion de ultimos pagos
        await parser.parse();
        let ultimos_pagos = {
            info_pagos: parser.get_info_ultimos_pagos()
        }
        //console.log(ultimos_pagos);
    });

    it("debe parser la informacion de los resultados_parciales", async ()=>{
      
        await parser.parse();
        let resultados_parciales = {
            info_parciales: parser.get_info_resultados_parciales()
        };
        let resultado_esperado = utils.parse_json(`${resources}/resultado_parciales_json.json`);
        expect(resultados_parciales).toEqual(resultado_esperado);

    });
    it("debe parsear la informacion de las habilitacion", async ()=>{

        await parser.parse();
        let resultado_habilitaciones = {
            info_habilitaciones: parser.get_info_habilitaciones_actuales()
        };

       let resultado_esperado = utils.parse_json(`${resources}/resultado_habilitacion_json.json`);
       expect(resultado_habilitaciones).toEqual(resultado_esperado);

    });

    it("debe parsear la informacion de los finales", async ()=>{
        // todo: obtener informacin para la seccion de finales
        await parser.parse();
        let resultado_finales = {
            info_finales : parser.get_info_resultados_evaluaciones_finales()
        };
       // console.log(resultado_finales);
    });

    it("debe parser la informacion de las calificaciones", async ()=>{
        await parser.parse();
        let resultado_calificaciones = {
            info_calificaciones: parser.get_info_calificaciones()
        };
        let resultado_esperado = utils.parse_json(`${resources}/calificaciones_json.json`);
        expect(resultado_calificaciones).toEqual(resultado_esperado);
    });
    it("debe parser la informacion de las materias pendientes", async ()=>{
        await parser.parse();
        let resultado_materia_pendiente = {
            info_materia_pendiente: parser.get_info_materia_pendiente()
        };
        let resultado_esperado = utils.parse_json(`${resources}/meteria_pendientes_json.json`);
        expect(resultado_materia_pendiente).toEqual(resultado_esperado);
    });


    it("debe parsear la informacion de extension", async ()=>{
        await parser.parse();
        let resultado_extension = {
            info_extension: parser.get_info_extension()
        };
        let resultado_esperado = utils.parse_json(`${resources}/extension_json.json`);
        expect(resultado_extension).toEqual(resultado_esperado);
    });
    it("debe parsear la informacion de horario de clases", async ()=>{
        await parser.parse();
        let resultado_horarios = {
            info_extension: parser.get_info_horario_clase()
        };
       let resultado_esperado = utils.parse_json(`${resources}/horario_clases_json.json`);
       expect(resultado_horarios).toEqual(resultado_esperado);
       
    });

    it("debe parsear la informacion de horario docente", async ()=>{
        //todo: se necesito info de esta seccionpara poder testear si parsea
    });

    it("debe parsear la informacion de reservas", async ()=>{
        //todo: se necesito info de esta seccionpara poder testear si parsea
    });
    it("debe parsear la informacion de prestamos", async ()=>{
         //todo: se necesito info de esta seccionpara poder testear si parsea
    });
});