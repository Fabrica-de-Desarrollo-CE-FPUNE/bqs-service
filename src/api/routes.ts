import { Router } from 'express';
import { ConsultorScraperPuppeteer } from '../bot/scraper/ConsultorScraperImp';
import { Alumno_credencial_login } from '../types/ConsultorEstudianteCredenciales.types';
import { ConsultorTableProcessor } from '../bot/processors/ConsultorTableProcessor';
import { ConsultorBasicEstudianteInfoParser, ConsultorTableEstudianteTableInfoParser } from '../bot/parser/ConsultorParser';
import { ConsultorService } from '../core/ConsultorService';
const router = Router();

router.get('/info/', async (req, res) => {

    const {user, pass} = req.query;

    if(!user || !pass){
      res.status(404).send({
        Error: 'porfavor provea su cedula y contrasenia'
      });
      return;
    }
    const credenciales: Alumno_credencial_login = {
      cedula: user as string, 
      contrasenia: pass as string
    };
    const scraper = new ConsultorScraperPuppeteer(credenciales);
    await scraper.init();
    await scraper.gotoLogIn();
    await scraper.logIn();
    const html = await scraper.extractPageContent() as string;
    await scraper.reset();

    const processor = new ConsultorTableProcessor(html);
    const contents = await processor.process();
    const basicParser = new ConsultorBasicEstudianteInfoParser(html);
    const tableparser = new ConsultorTableEstudianteTableInfoParser(contents);
    tableparser.parse();
    const servicelayer= new ConsultorService(basicParser, tableparser);
    const result = await servicelayer.getAll_Consultor_Info();
    return res.status(200).send(result);

});

export { router };
