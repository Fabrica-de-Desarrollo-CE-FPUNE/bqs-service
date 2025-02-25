import { Entity, ManyToOne, OneToMany } from "typeorm";
import { Base } from "./Base";
import { Facultad } from "./Facultad";
import { Perfil } from "./Perfil";
import { MateriaCarrera } from "./MateriaCarrera";

@Entity()
export class Carrera extends Base {

    @OneToMany(()=>Perfil, (perfil)=>perfil.carrera)
    public perfiles:Perfil[];

    @ManyToOne(()=>Facultad, (facultad)=>facultad.carreras)
    public facultad:Facultad;

    @OneToMany(()=>MateriaCarrera, (materiaCarrera)=>materiaCarrera.carrera)
    public materiasCarreras:MateriaCarrera[];

    constructor(carrera?:string){
        if(carrera){
            super(carrera);
            return;
        }
        super();
    }
}