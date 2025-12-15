import { EscalaController } from "../../postgre/controller/EscalaController"


const escalaController = new EscalaController();

export const getEscalas = async () => {
    return await escalaController.getAll();
}