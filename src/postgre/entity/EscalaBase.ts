import { Column } from "typeorm";
import { info_resultado_parcial } from "../../types/ConsultorEstudiante.types";

export class EscalaBase {
    
    @Column('float')
    public primeraParcial:number = 0;

    @Column('float')
    public segundaParcial:number = 0;

    @Column('float')
    public trabajoPractico:number = 0;

    @Column('float')
    public trabajoLaboratorio:number = 0;

    constructor(data?:info_resultado_parcial){
        
        if(data) {
            const {primera_parcial, segunda_parcial, trabajo_laboratorio, trabajo_practico} = data;
            this.primeraParcial = Number(primera_parcial);
            this.segundaParcial = Number(segunda_parcial);
            this.trabajoLaboratorio = Number(trabajo_laboratorio);
            this.trabajoPractico = Number(trabajo_practico);
        }
    }

}