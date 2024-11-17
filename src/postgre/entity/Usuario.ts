import { Entity, Column, OneToMany } from "typeorm"
import { Inscripcion } from "./Inscripcion"
import { Base } from "./Base"

@Entity()
export class Usuario extends Base {

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
