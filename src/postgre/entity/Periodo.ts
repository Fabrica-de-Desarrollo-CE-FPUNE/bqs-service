import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';
import { Inscripcion } from './Inscripcion';
import { info_inscripciones_asistencia } from '../../types/ConsultorEstudiante.types';
import { parseFechaDDMMYYYY } from '../../utils/dataUtil';

@Entity()
export class Periodo {

    @PrimaryGeneratedColumn()
    id:number;

    @Column("date",{nullable:false, unique:true})
    fechaInscripcion: Date;

    @Column("date",{nullable:false, unique:true})
    fechaVigencia: Date;


    @OneToMany(()=>Inscripcion, (inscripcion)=>inscripcion.periodo)
    inscripciones:Inscripcion[];


    constructor(data?:info_inscripciones_asistencia) {

        if(data){
            this.fechaInscripcion = parseFechaDDMMYYYY(data.fecha_inscripto);
            this.fechaVigencia = parseFechaDDMMYYYY(data.validez);
        }

    }

}