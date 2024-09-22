import jwt from 'jsonwebtoken';

const SECRET_KEY: string = "la super contraseña que debería ser anonima y ubicada como variable de entorno"+
" pero que siento que es muy inseguro igual y prefiero hacer que sea dinamico";

export const firmarToken = (data:any)=>{
    return  jwt.sign(data, SECRET_KEY );
}