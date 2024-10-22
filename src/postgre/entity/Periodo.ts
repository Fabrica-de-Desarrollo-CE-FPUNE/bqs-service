import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class Periodo {

    @PrimaryGeneratedColumn()
    id:number

    @Column("date",{nullable:false})
    fechaInscripcion: Date

    @Column("date",{nullable:false})
    fechaVigencia: Date

}