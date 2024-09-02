import { Dayjs } from "dayjs";

export interface ITask {
    ejecutarUnaVez:boolean,
    ejecutarInmediatamente:boolean,
    intervalo:Dayjs,
}