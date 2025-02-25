import { Entity, OneToMany } from "typeorm";
import { getMateria } from "../../utils/dataUtil";
import { MateriaCarrera } from "./MateriaCarrera";
import { Base } from "./Base";

@Entity()
export class Materia extends Base {

    @OneToMany(()=>MateriaCarrera, (materiaCarrera)=>materiaCarrera.materia)
    public materiasCarreras:MateriaCarrera[];

    constructor (nombreMateria?:string) {
        if(nombreMateria){
            const {nombre} = getMateria(nombreMateria);
            super(nombre);
            return;
        }
        super();
    }
}