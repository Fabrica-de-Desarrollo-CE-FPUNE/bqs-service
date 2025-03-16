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
    public porcentaje_asistencia:number;

    @Column("char", {nullable:false})
    public grupo:string

    @ManyToOne(()=>Perfil, (perfil)=>perfil.inscripciones, {nullable:false})
    @JoinColumn({name:'perfil_id'})
    public perfil: Perfil;

    @ManyToOne(()=>MateriaCarrera, (materiaCarrera)=>materiaCarrera.inscripciones, {eager:true, nullable:false})
    @JoinColumn({name:'materia_carrera_id'})
    public materiaCarrera: MateriaCarrera;

    @ManyToOne(()=>Periodo, (periodo)=>periodo.inscripciones, {eager:true, nullable:false})
    @JoinColumn({name:'periodo_id'})
    public periodo:Periodo;

    // Por comodidad voy a hacer que sea bidireccional, tambien en ResultadoParcial, el otro tendra la clave fóranea
    @OneToOne(()=>ResultadoParcial, (resultadoParcial)=>resultadoParcial.inscripcion, {eager:true})
    resultadoParcial:ResultadoParcial;

    //Muchas inscripciones pueden tener muchos examenes finales (excepto los que no exoneran con 4 xD)
    @OneToMany(()=>ExamenFinal, (examenFinal)=>examenFinal.inscripcion, {eager:true})
    examenesFinales: ExamenFinal[];

    @ManyToOne(()=>Escala, (escala)=>escala.inscripciones, {eager:true})
    @JoinColumn({name:'escala_id'})
    escala:Escala;

    constructor(info?:info_inscripciones_asistencia){
        if(info){
            this.porcentaje_asistencia = Number(info.porc_asistencias);
            this.grupo = info.grupo;
        }
    }
}