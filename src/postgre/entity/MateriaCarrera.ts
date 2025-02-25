import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Materia } from "./Materia";
import { Carrera } from "./Carrera";
import { Inscripcion } from "./Inscripcion";

@Entity()
export class MateriaCarrera {

    @PrimaryGeneratedColumn()
    public id:number;

    @Column({nullable:false})
    public semestre:number;

    @ManyToOne(()=>Materia, (materia)=>materia.materiasCarreras, {eager:true})
    public materia:Materia;

    @ManyToOne(()=>Carrera, (carrera)=> carrera.materiasCarreras, {eager:true})
    public carrera:Carrera;

    @OneToMany(()=>Inscripcion, (inscripcion)=>inscripcion.materiaCarrera)
    public inscripciones:Inscripcion[];

    constructor(data?:{carrera:Carrera, materia:Materia, semestre:string|number}){
        if(data){
            const {materia, carrera, semestre} = data
            this.carrera = carrera;
            this.materia = materia;
            this.semestre = semestre?Number(semestre):0;
        }
    }
}