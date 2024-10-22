import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable, OneToMany } from "typeorm"
import { Periodo } from "./Periodo"
import { Inscripcion } from "./Inscripcion"

@Entity()
export class Materia {

    @PrimaryColumn()
    id: number

    @Column("varchar", { length: 30 })
    materia: string

    @ManyToMany(()=>Periodo, (periodo)=>periodo.id)
    @JoinTable()
    periodos: Periodo[]

    @OneToMany(()=>Inscripcion, (inscripcion)=>inscripcion.materia)
    inscripciones:Inscripcion[]
    
}
