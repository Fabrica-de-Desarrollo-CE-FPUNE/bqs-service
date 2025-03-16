import { Column } from "typeorm";
import { info_resultado_parcial } from "../../types/ConsultorEstudiante.types";

export class EscalaBase {
    
    @Column('float')
    public primera_parcial:number = 0;

    @Column('float')
    public segunda_parcial:number = 0;

    @Column('float')
    public trabajo_practico:number = 0;

    @Column('float')
    public trabajo_laboratorio:number = 0;

    constructor(data?:info_resultado_parcial){
        
        if(data) {
            const {primera_parcial, segunda_parcial, trabajo_laboratorio, trabajo_practico} = data;
            this.primera_parcial = Number(primera_parcial);
            this.segunda_parcial = Number(segunda_parcial);
            this.trabajo_laboratorio = Number(trabajo_laboratorio);
            this.trabajo_practico = Number(trabajo_practico);
        }
    }

}