

import * as fs from 'fs';
import { IConsultorService } from '../src/core/Services.interfaces';
import { ConsultorService } from './../src/core/ConsultorService';
import { vista_info_consultor } from '../src/types/ConsultorEstudianteVistas.types';
import { ConsultorBasicEstudianteInfoParser, ConsultorTableEstudianteTableInfoParser } from '../src/bot/parser/ConsultorParser';
import { ConsultorTableProcessor } from './../src/bot/processors/ConsultorTableProcessor';
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

describe("consultorservice",() => {
    it("devolver todos los datos integrando los componentes", async () => {
        const stringcontent = readFile(resources+"consultor_data.html");
       const basicParser = new ConsultorBasicEstudianteInfoParser(stringcontent);
       const tableParser = new ConsultorTableEstudianteTableInfoParser(await new ConsultorTableProcessor(stringcontent).process());
       tableParser.parse();
       const service: IConsultorService = new ConsultorService(basicParser, tableParser);
       const result: vista_info_consultor = await service.getAll_Consultor_Info();
       const expected_result = JSON.parse(readFile(resources+"integration_test_expected_result.json"));
       expect(result).toEqual(expected_result);
    });

  });
