import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Inscripcion } from './Inscripcion';
import { info_resultado_evaluacion_final } from '../../types/ConsultorEstudiante.types';
import { parseFechaDDMMYYYY } from '../../utils/dataUtil';
@Entity()
export class ExamenFinal {

    @PrimaryGeneratedColumn()
    id:number;

    @Column('date')
    fecha:Date;

    @Column('float')
    final:number;

    @Column('varchar', {length:8})
    nota:string;

    @ManyToOne(()=>Inscripcion,(inscripcion)=>inscripcion.examenesFinales)
    inscripcion:Inscripcion;

    constructor(data?:info_resultado_evaluacion_final){
        if(data){
            const {fecha, nota, final} = data;

            this.fecha = parseFechaDDMMYYYY(fecha);
            this.nota = nota;
            this.final = Number(final.length?final:0);

        }
    }

}