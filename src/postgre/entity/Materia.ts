import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm"
import { Inscripcion } from "./Inscripcion"
import { getMateria } from "../../utils/dataUtil";
import logger from "../../log/logger";

@Entity()
export class Materia {

    @PrimaryColumn()
    public id:number;

    @Column('varchar', {length:50, nullable:false})
    public nombre:string;

    @Column()
    public semestre:number;

    @OneToMany(()=>Inscripcion, (inscripcion)=>inscripcion.materia)
    inscripciones:Inscripcion[];

    constructor (nombreMateria?:string) {

        if(nombreMateria){
            const {id, nombre, semestre} = getMateria(nombreMateria);

            this.id = id;
            this.nombre = nombre;
            
            if(semestre)
                this.semestre = semestre;
        }  
    }
}