import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "./Usuario";
import { Materia } from "./Materia";

@Entity()
export class Inscripcion {

    @PrimaryGeneratedColumn()
    public id: number

    @Column()
    public usuarioId: number

    @Column()
    public materiaId: number

    @Column("char", {nullable:false})
    public grupo:string

    @ManyToOne(()=>Usuario, (usuario)=>usuario.inscripciones)
    public usuario: Usuario

    @ManyToOne(()=>Materia, (materia)=>materia.inscripciones)
    public materia: Materia

}