import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Inscripcion } from "./Inscripcion"

@Entity()
export class Usuario {

    @PrimaryGeneratedColumn()
    id: number

    @Column("varchar", { length: 30 })
    nombreCompleto: string

    @Column("varchar", { length: 12, unique:true })
    cedulaIdentidad: string

    @Column("varchar", { length: 15, nullable:true })
    celular: string

    @Column("varchar", { length: 15, nullable:true })
    telefonoParticular: string

    @Column("varchar", { length: 30, nullable:true })
    email: string

    @OneToMany(()=>Inscripcion, (inscripcion)=>inscripcion.usuario)
    inscripciones:Inscripcion[]

}
