import { Column } from "typeorm";

export class EscalaBase {
    
    @Column()
    public primeraParcial:number = 0;

    @Column()
    public segundaParcial:number = 0;

    @Column()
    public trabajoPractico:number = 0;

    @Column()
    public trabajoLaboratorio:number = 0;

}