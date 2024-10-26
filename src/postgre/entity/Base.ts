import { Column, PrimaryGeneratedColumn } from "typeorm";

export abstract class Base {

    @PrimaryGeneratedColumn({comment:'Id y Clave Primaria de la tabla en cuestión.'})
    public id:number;

    @Column({type:'varchar', length:35, nullable:false,
        comment:'Se debe nombrar obligatoriamente para la tabla en cuestión.'
    })
    public nombre:string;
}