import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PerfilExtension } from "./PerfilExtension";
import { info_extension } from "../../types/ConsultorEstudiante.types";


@Entity()
export class Extension  {

    @PrimaryGeneratedColumn()
    public id:number;

    @Column("varchar",{length:80, nullable:false})
    public actividad:string;

    @Column('varchar', {length:80, nullable:false})
    public tipo_actividad:string;

    @Column('integer', {nullable:false})
    public maxima:number;

    @OneToMany(()=>PerfilExtension, (perfilExtension)=>perfilExtension.extension)
    public perfilExtensiones:PerfilExtension[];

    constructor(data?:info_extension){
        if(data){
            const {actividad, maxima, tipo_actividad} = data;
            this.actividad = actividad;
            this.maxima = maxima?Number(maxima):0;
            this.tipo_actividad = tipo_actividad;
        }
    }

}