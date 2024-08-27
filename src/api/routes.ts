import { Router } from 'express';
import { Alumno_credencial_login } from '../types/ConsultorEstudianteCredenciales.types';
import { ConsultorDataService } from '../core/ConsultorService';
import { StatusCodes } from 'http-status-codes';
const router = Router();

router.get('/info/', async (req, res) => {

    const {user, pass} = req.query;

    if(!user || !pass){
      res.status(404).send({
        Error: 'porfavor provea su cedula y contrasenia'
      });
      return;
    }
    const credenciales:Alumno_credencial_login = {
      cedula: user as string, 
      contrasenia: pass as string
    };
    const consultorService = new ConsultorDataService();
    const result = await consultorService.getAll_Consultor_Info(credenciales);
    return res.status(StatusCodes.OK).send(result);
});

export { router };
