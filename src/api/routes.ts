import { Router } from 'express';
import { Alumno_credencial_login } from '../types/ConsultorEstudianteCredenciales.types';
const router = Router();

router.get('/info/', async (req, res) => {

    const {user, pass} = req.query;

    if(!user || !pass){
      res.status(404).send({
        Error: 'porfavor provea su cedula y contrasenia'
      });
      return;
    }
 /*   const credenciales: Alumno_credencial_login = {
      cedula: user as string, 
      contrasenia: pass as string
    };
    const html = await new ConsultorScraper(credenciales).getConsultorDetallesPage();
    const processor = new ConsultorTableProcessor(html);
    const contents = await processor.process();
    const basicParser = new ConsultorBasicEstudianteInfoParser(html);
    const tableparser = new ConsultorTableEstudianteTableInfoParser(contents);
    tableparser.parse();
    const servicelayer= new ConsultorService(basicParser, tableparser);
    const result = await servicelayer.getAll_Consultor_Info();
    return res.status(200).send(result);*/

});

export { router };
