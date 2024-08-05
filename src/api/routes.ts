import { Router } from 'express';
const router = Router();

router.get('/info/', async (req, res) => {

    const {user, pass} = req.query;

    if(!user || !pass){
      res.status(404).send({
        Error: 'Error en el username o password'
      });
      return;
    }
});

export { router };
