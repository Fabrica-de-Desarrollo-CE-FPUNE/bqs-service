import { Dayjs } from "dayjs";
import { ITask } from "./ITask";

export abstract class TaskBase implements ITask {

    ejecutarUnaVez: boolean;
    ejecutarInmediatamente: boolean;
    intervalo: Dayjs;
    

    
    constructor(taskConfig:ITask){
        this.ejecutarInmediatamente = taskConfig.ejecutarInmediatamente;
        this.ejecutarUnaVez = taskConfig.ejecutarUnaVez
        this.intervalo = taskConfig.intervalo
    }

    abstract ejecutar:()=>Promise<void>
}