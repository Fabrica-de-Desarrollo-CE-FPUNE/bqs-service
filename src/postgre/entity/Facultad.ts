import { Column, Entity, OneToMany } from "typeorm";
import { Base } from "./Base";
import { Carrera } from "./Carrera";

@Entity()
export class Facultad extends Base {

    @Column("varchar",{nullable:false, length:8})
    public abreviacion:string
    
    @OneToMany(()=>Carrera, (carrera)=>carrera.facultad)
    public carreras:Carrera[];

    constructor(nombre?:string) {
        if(nombre){
            super(nombre);
            return;
        }
        super();
    }
}