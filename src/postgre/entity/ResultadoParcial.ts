import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EscalaBase } from "./EscalaBase";
import { Inscripcion } from "./Inscripcion";
import { info_resultado_parcial } from "../../types/ConsultorEstudiante.types";

@Entity()
export class ResultadoParcial extends EscalaBase  {

    @PrimaryGeneratedColumn()
    id:number;

    //Ahora podemos buscar indistintamente usando repository con esta clase y con la otra
    @OneToOne(()=>Inscripcion, (inscripcion)=>inscripcion.resultadoParcial)
    @JoinColumn({name:'inscripcion_id'})
    inscripcion:Inscripcion

    constructor(data?: info_resultado_parcial){
        if(data) {
            super(data)
        } else {
            super(data);
        }
    }

}