
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
  
}
);