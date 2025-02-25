import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';
import { Inscripcion } from './Inscripcion';
import { info_inscripciones_asistencia } from '../../types/ConsultorEstudiante.types';
import { parseFechaDDMMYYYY } from '../../utils/dataUtil';
import { Base } from './Base';

@Entity()
export class Periodo extends Base{


    @Column("date",{nullable:false})
    fechaInscripcion: Date;

    @Column("date",{nullable:false})
    fechaVigencia: Date;


    @OneToMany(()=>Inscripcion, (inscripcion)=>inscripcion.periodo)
    inscripciones:Inscripcion[];


    constructor(data?:info_inscripciones_asistencia) {

        if(data){
            const {fecha_inscripto, validez} = data;
            super(`${fecha_inscripto}-${validez}`);
            this.fechaInscripcion = parseFechaDDMMYYYY(data.fecha_inscripto);
            this.fechaVigencia = parseFechaDDMMYYYY(data.validez);
            return;
        }
        super();

    }

}