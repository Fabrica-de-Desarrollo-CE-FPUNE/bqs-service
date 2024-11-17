import { Entity, OneToMany } from "typeorm"
import { Inscripcion } from "./Inscripcion"
import { Base } from "./Base"

@Entity()
export class Materia extends Base {

    @OneToMany(()=>Inscripcion, (inscripcion)=>inscripcion.materia)
    inscripciones:Inscripcion[]

}
