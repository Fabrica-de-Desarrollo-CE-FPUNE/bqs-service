import jwt from 'jsonwebtoken';
import { ClaveTokenUtil } from './ClaveTokenUtil';

export const firmarToken = (data:any)=>{
    const claveTokenUtil = ClaveTokenUtil.getInstance();
    if(claveTokenUtil.getClave()===""){
        claveTokenUtil.generarClave()
    }
    return  jwt.sign(data, claveTokenUtil.getClave());
}