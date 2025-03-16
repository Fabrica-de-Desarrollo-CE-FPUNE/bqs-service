import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Base } from "./Base";
import { EscalaBase } from "./EscalaBase";
import { getEscala } from "../../utils/dataUtil";
import { Inscripcion } from "./Inscripcion";

@Entity()
export class Escala extends EscalaBase {

    @PrimaryGeneratedColumn()
    public id:number;

    @Column({nullable:false, length:20})
    public nombre:string


    @OneToMany(()=>Inscripcion, (inscripcion)=>inscripcion.escala)
    public inscripciones: Inscripcion[]


    constructor(nombre?:string){
        super();
        if(nombre){
            this.nombre = nombre;
            const {primera_parcial, segunda_parcial, trabajo_laboratorio, trabajo_practico} = getEscala(nombre)
            this.primera_parcial = primera_parcial;
            this.segunda_parcial = segunda_parcial;
            this.trabajo_laboratorio = trabajo_laboratorio;
            this.trabajo_practico = trabajo_practico;
        }
        
    }
}
