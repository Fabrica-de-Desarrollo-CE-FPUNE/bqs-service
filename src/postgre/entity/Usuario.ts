import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Perfil } from "./Perfil";
import { Alumno_credencial_login } from "../../types/ConsultorEstudianteCredenciales.types";
import { encrypt } from "../../utils/crypto";


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
        this.password = encrypt(usuario.contrasenia);
    }

    constructor(usuario?:Alumno_credencial_login){
        if(usuario)
           this.init(usuario);   
    }
}