import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { hashearString } from "../../utils/dataUtil";
import { Perfil } from "./Perfil";
import { Alumno_credencial_login } from "../../types/ConsultorEstudianteCredenciales.types";


@Entity()
export class Usuario {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column('varchar', {nullable:false, length:12, unique:true})
    cedula:string;

    @Column('varchar', {
        nullable:false, length:150
    })
    password:string;

    @OneToOne(()=>Perfil, (perfil)=>perfil.usuario)
    perfil:Perfil;

    public async init(usuario:Alumno_credencial_login){
        this.cedula = usuario.cedula;
        this.password = await hashearString(usuario.contrasenia);
    }

    constructor(usuario?:Alumno_credencial_login){
        if(usuario)
           this.init(usuario);   
    }
}