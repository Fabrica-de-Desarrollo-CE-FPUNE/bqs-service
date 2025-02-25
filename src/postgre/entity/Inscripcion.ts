import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Perfil } from './Perfil';
import { Materia } from "./Materia";
import { ResultadoParcial } from "./ResultadoParcial";
import { Periodo } from "./Periodo";
import { ExamenFinal } from "./ExamenFinal";
import { Escala } from "./Escala";
import { info_inscripciones_asistencia } from "../../types/ConsultorEstudiante.types";
import { MateriaCarrera } from './MateriaCarrera';

@Entity()
export class Inscripcion {

    @PrimaryGeneratedColumn()
    public id: number

    @Column('float')
    public porcentajeAsistencia:number;

    @Column("char", {nullable:false})
    public grupo:string

    @ManyToOne(()=>Perfil, (perfil)=>perfil.inscripciones, {nullable:false})
    public perfil: Perfil;

    @ManyToOne(()=>MateriaCarrera, (materiaCarrera)=>materiaCarrera.inscripciones, {eager:true, nullable:false})
    public materiaCarrera: MateriaCarrera;

    @ManyToOne(()=>Periodo, (periodo)=>periodo.inscripciones, {eager:true, nullable:false})
    public periodo:Periodo;

    // Por comodidad voy a hacer que sea bidireccional, tambien en ResultadoParcial, el otro tendra la clave fóranea
    @OneToOne(()=>ResultadoParcial, (resultadoParcial)=>resultadoParcial.inscripcion, {eager:true})
    resultadoParcial:ResultadoParcial;

    //Muchas inscripciones pueden tener muchos examenes finales (excepto los que no exoneran con 4 xD)
    @OneToMany(()=>ExamenFinal, (examenFinal)=>examenFinal.inscripcion, {eager:true})
    examenesFinales: ExamenFinal[];

    @ManyToOne(()=>Escala, (escala)=>escala.inscripciones, {eager:true})
    @JoinColumn()
    escala:Escala;

    constructor(info?:info_inscripciones_asistencia){
        if(info){
            this.porcentajeAsistencia = Number(info.porc_asistencias);
            this.grupo = info.grupo;
        }
    }
}