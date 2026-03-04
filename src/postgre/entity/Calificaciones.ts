import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MateriaCarrera } from "./MateriaCarrera";
import { Perfil } from "./Perfil";
import { Materia } from "./Materia";

@Entity()
export class Calificaciones {

    @PrimaryGeneratedColumn()
    public id: number;

    @JoinColumn({ name: 'materia_id' })
    @ManyToOne(() => Materia, (materias) => materias.calificaciones, { eager: false })
    public materia: Materia;

    @JoinColumn({ name: 'perfil_id' })
    @ManyToOne(() => Perfil, (perfil) => perfil.calificaciones, { eager: false })
    public perfil: Perfil;

    @Column()
    public nota: string;

    @Column()
    public acta: number;

    @Column("date", { nullable: false, })
    public fecha: string;


    constructor(data?: {
        perfil: Perfil,
        materia: Materia,
        nota: string,
        acta: number,
        fecha: string
    }) {
        if (data) {
            const { perfil, materia, nota, fecha, acta } = data;
            const [dia, mes, anho] = fecha.split('/').map(Number);
            this.perfil = perfil;
            this.materia = materia;
            this.nota = nota;
            this.acta = acta;
            this.fecha = (new Date(Date.UTC(anho, mes - 1, dia))).toISOString().split('T')[0];
        }
    }
}