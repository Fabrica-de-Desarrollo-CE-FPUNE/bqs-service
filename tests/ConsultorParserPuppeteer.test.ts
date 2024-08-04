
import { Alumno_credencial_login } from './../src/types/ConsultorInfoTipos/ConsultorEstudianteCredenciales';
import * as fs from 'fs';
import { ConsultoParserImp, ConsultorTableContentPreProcesor } from './../src/bot/parser/ConsultorParserImp';
import { TableContentObjects } from '../src/bot/parser/ConsultorParserInterfaces';
function readHtmlFile(filePath: string): string {
    try {
        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        return htmlContent;
    } catch (err) {
        console.error(`Error reading file from path ${filePath}:`, err);
        return '';
    }
}
describe("ConsultorPreProcesor", () => {
    it("deberia imprimir el html", async () => {
        const stringcontent = readHtmlFile("../bqs-service/resources/consultor_data.html");
        let processor: ConsultorTableContentPreProcesor = new ConsultorTableContentPreProcesor(stringcontent);
        const result: TableContentObjects = processor.get_TableConsultorObjects();
        //console.log(JSON.stringify(result, null, 2));
        expect(result).not.toBeNull();
    });
    it("deberia imprimir el html", async () => {
        const stringcontent = readHtmlFile("../bqs-service/resources/consultor_data.html");
        let parser: ConsultoParserImp = new ConsultoParserImp(stringcontent);
        console.log(parser.get_info_estudiante());
        console.log(parser.get_info_contacto());
        console.log(parser.get_info_tiempo_rendimiento());
    });
  });

