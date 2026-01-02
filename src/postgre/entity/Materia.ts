import { Entity, ManyToMany, OneToMany } from "typeorm";
import { getMateria } from "../../utils/dataUtil";
import { MateriaCarrera } from "./MateriaCarrera";
import { Base } from "./Base";
import { Calificaciones } from "./Calificaciones";

@Entity()
export class Materia extends Base {

    @OneToMany(() => MateriaCarrera, (materiaCarrera) => materiaCarrera.materia)
    public materiasCarreras: MateriaCarrera[];

    @OneToMany(() => Calificaciones, (calificaciones) => calificaciones.materia)
    public calificaciones: Calificaciones[];


    constructor(nombreMateria?: string) {
        if (nombreMateria) {
            const { nombre } = getMateria(nombreMateria);
            super(nombre);
            return;
        }
        super();
    }
}