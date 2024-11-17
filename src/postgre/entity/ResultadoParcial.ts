import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EscalaBase } from "./EscalaBase";
import { Inscripcion } from "./Inscripcion";
import { Escala } from "./Escala";

@Entity()
export class ResultadoParcial {

    @PrimaryGeneratedColumn()
    id:number;

    @Column(()=>EscalaBase)
    tu:EscalaBase

    //Ahora podemos buscar indistintamente usando repository con esta clase y con la otra
    @OneToOne(()=>Inscripcion, (inscripcion)=>inscripcion.id)
    @JoinColumn()
    inscripcion:Inscripcion

}