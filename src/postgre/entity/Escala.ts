import { Column, Entity, OneToMany } from "typeorm";
import { Base } from "./Base";
import { EscalaBase } from "./EscalaBase";
import { getEscala } from "../../utils/dataUtil";
import { Inscripcion } from "./Inscripcion";

@Entity()
export class Escala extends Base {

    @Column(()=>EscalaBase)
    max:EscalaBase;

    @OneToMany(()=>Inscripcion, (inscripcion)=>inscripcion.escala)
    public inscripciones: Inscripcion[]


    constructor(nombre?:string){

        if(nombre){
            super({nombre});
            const {primeraParcial, segundaParcial, trabajoLaboratorio, trabajoPractico} = getEscala(nombre);
            this.max = new EscalaBase();
            this.max.primeraParcial = primeraParcial;
            this.max.segundaParcial = segundaParcial;
            this.max.trabajoLaboratorio = trabajoLaboratorio;
            this.max.trabajoPractico = trabajoPractico;

        } else {
            super();
        }

    }
}
