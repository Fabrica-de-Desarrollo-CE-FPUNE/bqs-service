import { Request, Response, Router } from "express";


const estudianteRouter:Router = Router();

const urlRoute:string = '/estudiante';

estudianteRouter.get(urlRoute, async (req:Request, res:Response)=>{
    console.log(req.query);
    try {
        // Algún proceso de la capa de servicio...
        const resultado = {data:'Ok'};
        // Envio de la información de la capa...
        res.status(200).json(resultado);
    } catch (error) {
        // status(500) se utiliza para errores internos del servidor, sin embargo
        // no es una buena practica, trabajaremos en un middleware de handler de errores.
        res.status(500).json({error:'Error interno del servidor: (Causa)' + error});
    }
});

export default estudianteRouter;