import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Materia } from "./Materia";
import { ResultadoParcial } from "./ResultadoParcial";
import { Periodo } from "./Periodo";
import { ExamenFinal } from "./ExamenFinal";
import { Escala } from "./Escala";

@Entity()
export class Inscripcion {

    @PrimaryGeneratedColumn()
    public id: number

    @Column()
    public usuarioId: number;

    @Column()
    public materiaId: number;

    @Column("char", {nullable:false})
    public grupo:string

    @ManyToOne(()=>Usuario, (usuario)=>usuario.inscripciones)
    public usuario: Usuario;

    @ManyToOne(()=>Materia, (materia)=>materia.inscripciones)
    public materia: Materia;

    @ManyToMany(()=>Periodo, (periodo)=>periodo.inscripciones)
    @JoinTable()
    public periodos:Periodo[];

    // Por comodidad voy a hacer que sea bidireccional, tambien en ResultadoParcial, el otro tendra la clave fóranea
    @OneToOne(()=>ResultadoParcial, (resultadoParcial)=>resultadoParcial.id)
    resultadoParcial:ResultadoParcial;

    //Muchas inscripciones pueden tener muchos examenes finales (excepto los que no exoneran con 4 xD)
    @ManyToMany(()=>ExamenFinal, (examenFinal)=>examenFinal.inscripciones)
    examenesFinales: ExamenFinal[];

    @ManyToOne(()=>Escala, (escala)=>escala.id)
    @JoinColumn()
    escala:Escala;
}