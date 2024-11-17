import { Column, Entity } from "typeorm";
import { Base } from "./Base";
import { EscalaBase } from "./EscalaBase";

@Entity()
export class Escala extends Base {

    @Column(()=>EscalaBase)
    max:EscalaBase;

}
