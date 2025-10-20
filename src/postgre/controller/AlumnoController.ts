import { EntityManager } from 'typeorm';
import logger from '../../log/logger';
import { info_calificaciones, info_extension } from '../../types/ConsultorEstudiante.types';
import { vista_info_consultor } from '../../types/ConsultorEstudianteVistas.types';
import { formatearFecha, getMateria } from '../../utils/dataUtil';
import { Carrera } from '../entity/Carrera';
import { Escala } from '../entity/Escala';
import { ExamenFinal } from '../entity/ExamenFinal';
import { Extension } from '../entity/Extension';
import { Inscripcion } from '../entity/Inscripcion';
import { Materia } from '../entity/Materia';
import { MateriaCarrera } from '../entity/MateriaCarrera';
import { Perfil } from '../entity/Perfil';
import { PerfilExtension } from '../entity/PerfilExtension';
import { Periodo } from '../entity/Periodo';
import { ResultadoParcial } from '../entity/ResultadoParcial';
import { Usuario } from '../entity/Usuario';
import { CarreraController } from './CarreraController';
import { EscalaController } from './EscalaController';
import { ExtensionController } from './ExtensionController';
import { FinalController } from './FinalController';
import { InscripcionController } from './InscripcionController';
import { MateriaCarreraController } from './MateriaCarreraController';
import { MateriaController } from './MateriaController';
import { ParcialController } from './ParcialController';
import { PerfilController } from './PerfilController';
import { PerfilExtensionController } from './PerfilExtensionController';
import { PeriodoController } from './PeriodoController';

export class AlumnoController {

    private carreraController: CarreraController;
    private perfilController: PerfilController;
    private periodoController: PeriodoController;
    private materiaController: MateriaController;
    private materiaCarreraController: MateriaCarreraController;
    private escalaController: EscalaController;
    private inscripcionController: InscripcionController;
    private parcialController: ParcialController;
    private finalController: FinalController;
    private extensionController: ExtensionController;
    private perfilExtensionController: PerfilExtensionController;

    constructor(private tx: EntityManager) {
        this.carreraController = new CarreraController(this.tx);
        this.perfilController = new PerfilController(this.tx);
        this.periodoController = new PeriodoController(this.tx);
        this.materiaController = new MateriaController(this.tx);
        this.materiaCarreraController = new MateriaCarreraController(this.tx);
        this.escalaController = new EscalaController(this.tx);
        this.inscripcionController = new InscripcionController(this.tx);
        this.parcialController = new ParcialController(this.tx);
        this.finalController = new FinalController(this.tx);
        this.extensionController = new ExtensionController(this.tx);
        this.perfilExtensionController = new PerfilExtensionController(this.tx);
    }

    public async guardarAlumnoData(usuario: Usuario, info: vista_info_consultor): Promise<void> {
        const carreraTemp = new Carrera(info.info_rendimiento.carrera);
        const carrera = await this.carreraController.gestionar(carreraTemp);

        await this.guardarMateriasCursadas(carrera, info.info_calificaciones);
        
        let alumno = new Perfil({ vista_info_consultor: info });
        alumno.usuario = usuario;
        alumno.carrera = carrera;
        alumno = await this.perfilController.gestionar(alumno);
        
        await this.guardarExtension(alumno, info.info_extensiones);

        let periodo: Periodo | undefined;

        for (const inscripcion of info.info_inscripciones) {
            const dataParciales = info.info_parciales.find(value => value.materia.includes(inscripcion.materia))!;

            if (!periodo || formatearFecha(periodo.fecha_inscripcion) !== inscripcion.fecha_inscripto) {
                periodo = await this.periodoController.gestionar(new Periodo(inscripcion));
            }

            const materia = await this.materiaController.gestionar(new Materia(inscripcion.materia));
            const materiaCarrera = await this.materiaCarreraController.gestionar(
                new MateriaCarrera({ carrera, materia, semestre: getMateria(inscripcion.materia).semestre ?? 0 })
            );
            const escala = await this.escalaController.gestionar(new Escala(dataParciales.evaluacion));

            const inscripcionTemp = new Inscripcion(inscripcion);
            inscripcionTemp.perfil = alumno;
            inscripcionTemp.periodo = periodo;
            inscripcionTemp.escala = escala;
            inscripcionTemp.materiaCarrera = materiaCarrera;
            
            const inscripcionData = await this.inscripcionController.gestionar(inscripcionTemp);
            
            const parcial = new ResultadoParcial(dataParciales);
            parcial.inscripcion = inscripcionData;
            await this.parcialController.gestionar(parcial);

            for (const final of info.info_finales) {
                const finalTemp = new ExamenFinal(final);
                finalTemp.inscripcion = inscripcionData;
                await this.finalController.gestionar(finalTemp);
            }
        }
    }

    private async guardarExtension(perfil: Perfil, extensiones: info_extension[]): Promise<void> {
        const extensionesCorregidas = [...extensiones];
        extensionesCorregidas.pop();

        for (const extension of extensionesCorregidas) {
            try {
                const extensionNuevo = await this.extensionController.gestionar(new Extension(extension));
                if (extensionNuevo) {
                    const { horas, cantidad } = extension;
                    const perfilExtension = new PerfilExtension();
                    perfilExtension.extension = extensionNuevo;
                    perfilExtension.cantidad = cantidad ? Number(cantidad) : 0;
                    perfilExtension.horas = horas ? Number(horas) : 0;
                    perfilExtension.perfil = perfil;
                    await this.perfilExtensionController.gestionar(perfilExtension);
                }
            } catch (error) {
                logger.warn('Ocurrió un error y no se pudo registrar una extension', error);
            }
        }
    }

    private async guardarMateriasCursadas(carrera: Carrera, info_calificaciones: info_calificaciones[]): Promise<void> {
        for (const data of info_calificaciones) {
            try {
                const materia = await this.materiaController.gestionar(new Materia(data.materia));
                if (materia) {
                    await this.materiaCarreraController.gestionar(
                        new MateriaCarrera({ carrera, materia, semestre: data.semestre })
                    );
                }
            } catch {
                logger.warn('Ocurrió un error y no se pudo registrar una materia');
            }
        }
    }
}