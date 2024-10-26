import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Inscripcion } from './Inscripcion';
@Entity()
export class ExamenFinal {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'date'})
    fecha:Date;

    @Column({nullable:true})
    resultado:number;

    @ManyToMany(()=>Inscripcion,(inscripcion)=>inscripcion.examenesFinales)
    inscripciones:Inscripcion[];

}