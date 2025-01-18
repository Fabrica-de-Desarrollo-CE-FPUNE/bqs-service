import dayjs from "dayjs";
import { ClaveTokenUtil } from "../../api/utils/ClaveTokenUtil";
import { TaskBase } from "../TaksBase";

export class ClaveTokenTask extends TaskBase {
    
    constructor(){
     super({ejecutarInmediatamente:true, ejecutarUnaVez:false, intervalo: dayjs().add(3,"days") })   
    }

    private generarNuevaClave = async ()=>{
        const claveUtil = ClaveTokenUtil.getInstance();
        claveUtil.generarClave();
    }

    ejecutar = this.generarNuevaClave
}


