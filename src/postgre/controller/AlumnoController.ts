import { Repository } from "typeorm";
import { vista_info_consultor } from "../../types/ConsultorEstudianteVistas.types";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entity/Usuario";
import logger from "../../log/logger";
import { Inscripcion } from '../entity/Inscripcion';
import { Periodo } from "../entity/Periodo";
import { info_inscripciones_asistencia, info_resultado_evaluacion_final, info_resultado_parcial } from '../../types/ConsultorEstudiante.types';
import { formatearFecha, parseFechaDDMMYYYY } from "../../utils/dataUtil";
import { Materia } from "../entity/Materia";
import { Escala } from "../entity/Escala";
import { ResultadoParcial } from "../entity/ResultadoParcial";
import { ExamenFinal } from "../entity/ExamenFinal";

export class AlumnoController {

    private usuarioRepositorio:Repository<Usuario>;
    private inscripcionRepositorio:Repository<Inscripcion>;
    private materiaRepositorio:Repository<Materia>;
    private periodoRepositorio:Repository<Periodo>;
    private escalaRepositorio:Repository<Escala>;
    private parcialesRepositorio:Repository<ResultadoParcial>;
    private finalesRepositorio:Repository<ExamenFinal>;
    

    constructor(){
        this.init().then(()=>{
            logger.info('Base de datos conectada correctamente. iniciando repositorios.');
            this.usuarioRepositorio = AppDataSource.getRepository(Usuario);
            this.inscripcionRepositorio = AppDataSource.getRepository(Inscripcion);
            this.periodoRepositorio = AppDataSource.getRepository(Periodo);
            this.materiaRepositorio = AppDataSource.getRepository(Materia);
            this.escalaRepositorio = AppDataSource.getRepository(Escala);
            this.parcialesRepositorio = AppDataSource.getRepository(ResultadoParcial);
            this.finalesRepositorio = AppDataSource.getRepository(ExamenFinal);
        });
    }

    private async init() {
        if(!AppDataSource.isInitialized){
            await AppDataSource.initialize();
        } 
    }

    private async gestionarPeriodo(inscripcion:info_inscripciones_asistencia){
        return await this.periodoRepositorio.findOne({
            where:{
                fechaInscripcion:parseFechaDDMMYYYY(inscripcion.fecha_inscripto),
                fechaVigencia:parseFechaDDMMYYYY(inscripcion.validez)
            }
        }).then(async value=>{
            if(!value){
                logger.warn(`No se encontró el periodo con inscripcion ${inscripcion.fecha_inscripto} y validez ${inscripcion.validez}, intentando crear uno nuevo`)
                const nuevoPeriodo = new Periodo(inscripcion);
                return await this.periodoRepositorio.save(nuevoPeriodo).then(value=>{
                    logger.info(`Guardando periodo con id ${value.id}`);
                    return value;
                });
            }
            return value;
        });
    }

    private async gestionarInscripcion(infoInscripcion:info_inscripciones_asistencia , usuario:Usuario, materia:Materia, periodo:Periodo, escala:Escala){
        return await this.inscripcionRepositorio.findOne({
            where:{
                materia,
                usuario,
                periodo
            },
        }).then(async value => {
            if(!value){
                logger.warn(`No se encontró una inscripción del usuario ${usuario.id} con materia ${materia.id}, intentando crear uno nuevo`)
                const inscripcion = new Inscripcion(infoInscripcion);
                inscripcion.periodo = periodo;
                inscripcion.escala = escala;
                inscripcion.usuario = usuario;
                inscripcion.materia = materia;
                return await this.inscripcionRepositorio.save(inscripcion).then(value => {
                    logger.info(`Guardando inscripción con id ${value.id}`);
                    return value;
                })
            }
            return value;
        });
    }

    private async gestionarMateria(materia:Materia) {
        return await this.materiaRepositorio.findOne({
            where:{
                id: materia.id
            },
        }).then(async value=>{
            if(!value){
                logger.warn(`No se encontró la materia ${materia.nombre}, intentando crear uno nuevo.`);
                return await this.materiaRepositorio.save(materia).then(value=>{
                    logger.info(`Guardando materia con id ${value.id}`);
                    return value;
                });
            }
            return value;
        });
    }

    private async gestionarEscala(escala:string){
        return await this.escalaRepositorio.findOne({
            where:{
                nombre: escala
            }
        }).then(async value=>{
            if(!value) {
                logger.warn(`No se encontró la escala con estructura ${escala}, intentando crear uno nuevo.`);
                return await this.escalaRepositorio.save(new Escala(escala)).then(value => {
                    logger.info(`Guardando escala ${escala}`);
                    return value;
                })
            } else {
                return value
            }
        });
    }

    private async gestionarParcial (inscripcion:Inscripcion, parciales: info_resultado_parcial) {
        return await this.parcialesRepositorio.findOne({
            where:{
                inscripcion
            }
        }).then(async value => {
            if(!value){
                logger.warn(`No se encontró la parcial con respecto a la inscripción ${inscripcion.id}, intentando crear uno`);
                const parcial = new ResultadoParcial(parciales);
                parcial.inscripcion = inscripcion;
                return await this.parcialesRepositorio.save(parcial).then(value => {
                    logger.info(`Guardando resultados parciales ${value.id}`);
                    return value;
                });
            }
            return value;
        });
    }

    private async gestionarFinales (inscripcion:Inscripcion, final: info_resultado_evaluacion_final) {
        return await this.finalesRepositorio.findOne({
            where:{
                inscripcion:inscripcion
            }
        }).then(async value => {
            if(!value){

                logger.warn(`No se encontró una final correspondiente a inscripción con id ${inscripcion.id}, intentando crear uno nuevo`);

                const examenFinal = new ExamenFinal(final);
                examenFinal.inscripcion = inscripcion;
                return await this.finalesRepositorio.save(examenFinal).then(value => {
                    logger.info(`Guardando resultado final con id ${value.id}`);
                    return value;
                });
            }
            return value;
        });
    }


    public async guardarAlumnoData(info: vista_info_consultor){

        await this.init();

        let alumno = new Usuario({vista_info_consultor:info});
        alumno = await this.usuarioRepositorio.findOne({where:{
            cedulaIdentidad: alumno.cedulaIdentidad
        }}).then(async (value)=>{
            if(!value){
                logger.warn(`No se encontró al usuario con CI ${alumno.cedulaIdentidad}, intentando crear uno nuevo`)
                return await this.usuarioRepositorio.save(alumno).then(value=>{
                    logger.info(`Guardando usuario con id ${value.id}`);
                    return value;
                })
            } else {
                return value;
            }
        });
        
        let periodo:Periodo|null|undefined ;

        info.info_inscripciones.forEach( async (inscripcion) => {

            const dataParciales = info.info_parciales.filter(value =>
                value.materia.includes(inscripcion.materia)
            )[0];

            if(!periodo || (formatearFecha(periodo.fechaInscripcion) !== inscripcion.fecha_inscripto)){
                periodo = await this.gestionarPeriodo(inscripcion);
            }

            const materia = await this.gestionarMateria(new Materia(inscripcion.materia));

            const escala = await this.gestionarEscala(dataParciales.evaluacion);

            const inscripcionData = await this.gestionarInscripcion(inscripcion, alumno, materia, periodo, escala);
            
            await this.gestionarParcial(inscripcionData, dataParciales);

            info.info_finales.forEach( async final => {
                await this.gestionarFinales(inscripcionData, final);
            });

        });

    }

    public async extraerAlumnoData (cedula:string) {
        const usuario =  await this.usuarioRepositorio.findOne({
            where:{
                cedulaIdentidad: cedula
            },
            relationLoadStrategy:'join',
            loadEagerRelations:true,
        });

        if(usuario){
            logger.debug('El usuario existe buscando inscripciones');
            const inscripciones = await this.inscripcionRepositorio.find({
                where:{
                    usuario
                },
                loadEagerRelations:true,
            });
            console.log(inscripciones)
            usuario.inscripciones = inscripciones;
        }
        return usuario;
    }
}