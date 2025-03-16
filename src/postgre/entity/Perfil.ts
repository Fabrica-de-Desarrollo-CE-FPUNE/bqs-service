import { Entity, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from "typeorm"
import { Inscripcion } from "./Inscripcion"
import { Base } from "./Base"
import { vista_info_consultor } from "../../types/ConsultorEstudianteVistas.types"
import { info_contacto, info_estudiante } from '../../types/ConsultorEstudiante.types';
import { Usuario } from "./Usuario";
import { Libro } from "./Libro";
import { Carrera } from "./Carrera";
import { Alumno_credencial_login } from "../../types/ConsultorEstudianteCredenciales.types";

@Entity()
export class Perfil extends Base {

    @Column("varchar", { length: 12 })
    public cedula_de_identidad: string;

    @Column("varchar", { length: 15, nullable: true })
    public celular: string;

    @Column("varchar", { length: 15, nullable: true })
    public telefono_particular: string;

    @Column("varchar", { length: 30, nullable: true })
    public email: string;

    @Column("float", { nullable: false, default: 0 })
    public promedio: number;

    @Column("int", { nullable: false, default: 0 })
    public materias_aprobadas: number;

    @Column("int", { nullable: false, default: 0 })
    public materias_reprobadas: number;

    @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.perfil)
    public inscripciones: Inscripcion[];

    @OneToOne(() => Usuario, (usuario) => usuario.perfil)
    @JoinColumn({name:'usuario_id'})
    public usuario: Usuario;

    @OneToMany(() => Libro, (libro) => libro.perfilPrestamo)
    public librosPrestamos: Libro[];

    @OneToMany(() => Libro, (libro) => libro.perfilReserva)
    public librosReservas: Libro[];

    @ManyToOne(() => Carrera, (carrera) => carrera.perfiles)
    @JoinColumn({name:'carrera_id'})
    public carrera: Carrera

    constructor(data?: {
        vista_info_consultor?: vista_info_consultor,
        nueva_info?: {
            info_cabecera: info_estudiante,
            info_contacto: info_contacto
        },
        credencial?: Alumno_credencial_login
    }) {
        if (data) {
            const { vista_info_consultor, nueva_info, credencial } = data;

            if (vista_info_consultor || nueva_info) {

                const { info_cabecera, info_contacto } = vista_info_consultor ? vista_info_consultor : nueva_info!;

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
                    usuarioSeparado.filter((v, i) => i !== 0).join(' ').trim()
                );
                this.cedula_de_identidad = usuarioSeparado[0]; // Con el ejemplo ya se sabe que es la cédula.
                this.celular = info_contacto.celular;
                this.email = info_contacto.email;
                this.telefono_particular = info_contacto.telefono_particular;

                if (vista_info_consultor) {
                    const { info_rendimiento } = vista_info_consultor;
                    this.materias_aprobadas = Number(info_rendimiento.total_materias_aprobada);
                    this.materias_reprobadas = Number(info_rendimiento.total_materias_reprobadas);
                }
                return;

            } else if (credencial) {
                super();
                this.cedula_de_identidad = credencial.cedula;
                return;
            }
        }
        super()
    }

}
