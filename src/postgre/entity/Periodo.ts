import { Column, PrimaryGeneratedColumn, Entity, ManyToMany } from 'typeorm';
import { Inscripcion } from './Inscripcion';

@Entity()
export class Periodo {

    @PrimaryGeneratedColumn()
    id:number;

    @Column("date",{nullable:false})
    fechaInscripcion: Date;

    @Column("date",{nullable:false})
    fechaVigencia: Date;


    @ManyToMany(()=>Inscripcion, (inscripcion)=>inscripcion.periodos)
    inscripciones:Inscripcion[];

}