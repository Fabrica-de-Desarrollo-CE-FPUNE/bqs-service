import { Entity, Column, OneToMany, Index } from "typeorm"
import { Inscripcion } from "./Inscripcion"
import { Base } from "./Base"
import { vista_info_consultor } from "../../types/ConsultorEstudianteVistas.types"
import { info_contacto, info_estudiante } from "../../types/ConsultorEstudiante.types";

@Entity()
export class Usuario extends Base {

    @Column("varchar", { length: 12 })
    @Index('cedula-idx', {unique:true})
    cedulaIdentidad: string;

    @Column("varchar", { length: 15, nullable:true })
    celular: string;

    @Column("varchar", { length: 15, nullable:true })
    telefonoParticular: string;

    @Column("varchar", { length: 30, nullable:true })
    email: string;

    @OneToMany(()=>Inscripcion, (inscripcion)=>inscripcion.usuario)
    inscripciones:Inscripcion[];

    constructor(data?:{
        vista_info_consultor?:vista_info_consultor,
        nueva_info?:{
            info_cabecera:info_estudiante,
            info_contacto:info_contacto
        } 
    }){ 
        if (data) {
            const {vista_info_consultor, nueva_info} = data;  

            if (vista_info_consultor || nueva_info) {

                const {info_cabecera, info_contacto} = vista_info_consultor ? vista_info_consultor : nueva_info!;

                if (!info_cabecera || !info_contacto) {
                    throw new Error('Datos incompletos: faltan `info_cabecera` o `info_contacto`.');
                }

                /**
                 * Separamos la info, suponiendo que exista el valor 
                 ** "123123123 David Delvalle Rojas"
                    ** aquí se convertirá en un array 
                    * ['123123123', 'David', 'Delvalle', 'Rojas']
                    */

                const usuarioSeparado = info_cabecera.cedula_nombre_apellido.split(' ');
                super(
                    {
                        // Utilizamos el array ignorando el primer valor que obviamente es el número de cédula.
                        nombre: usuarioSeparado.filter((v,i)=>i!==0).join(' ').trim()
                    }
                );
                this.cedulaIdentidad = usuarioSeparado[0]; // Con el ejemplo ya se sabe que es la cédula.
                this.celular = info_contacto.celular;
                this.email = info_contacto.email;
                this.telefonoParticular = info_contacto.telefono_particular;
            }
        }
        else super()
    }

}
