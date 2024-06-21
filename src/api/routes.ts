import { Router } from 'express';
const router = Router();
import { LoginCredentials } from '../types/Credential';
import { loginQuarzo } from '../bot/Quarzo-extractor';
import { get_Info_titulo } from '../bot/Quarzo-Parser';
router.get('/info/', async (req, res) => {

    const {user, pass} = req.query;

    if(!user || !pass){
      res.status(404).send({
        Error: 'Error en el username o password'
      });
      return;
    }
    let credential: LoginCredentials = {
      password: pass.toString(), 
      username: user.toString()
    }
    let result = await loginQuarzo('http://servicios.fpune.edu.py:82/consultor/', credential);
    let parsedresult = get_Info_titulo(result);
    res.status(200).send({
         infoAlumnos:parsedresult
      });
});

export { router };
