import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Perfil } from "./Perfil";
import { Extension } from "./Extension";


@Entity()
export class PerfilExtension {

    @PrimaryGeneratedColumn()
    public id:number;

    @ManyToOne(()=>Perfil, (perfil)=>perfil.perfilExtensiones, {eager:true})
    public perfil:Perfil;

    @ManyToOne(()=>Extension, (extension)=>extension.perfilExtensiones, {eager:true})
    public extension:Extension;

    @Column('integer', {default:0, nullable:false})
    public cantidad:number;

    @Column('integer', {default:0, nullable:false})
    public horas:number

}