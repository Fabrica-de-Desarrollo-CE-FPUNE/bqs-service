
import logger from '../../log/logger';
import { info_calificaciones, info_extension } from '../../types/ConsultorEstudiante.types';
import { vista_info_consultor } from '../../types/ConsultorEstudianteVistas.types';
import { formatearFecha, getMateria } from '../../utils/dataUtil';
import { AppDataSource } from '../data-source';
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
import { FacultadController } from './FacultadController';
import { FinalController } from './FinalController';
import { InscripcionController } from './InscripcionController';
import { MateriaCarreraController } from './MateriaCarreraController';
import { MateriaController } from './MateriaController';
import { ParcialController } from './ParcialController';
import { PerfilController } from './PerfilController';
import { PerfilExtensionController } from './PerfilExtensionController';
import { PeriodoController } from './PeriodoController';

export class AlumnoController {

    public async guardarAlumnoData(usuario: Usuario, info: vista_info_consultor) {
        try {
            await AppDataSource.transaction(async tx => {
                const carreraController = new CarreraController();
                const perfilController = new PerfilController();
                const periodoController = new PeriodoController();
                const materiaController = new MateriaController();
                const materiaCarreraController = new MateriaCarreraController();
                const escalaController = new EscalaController();
                const inscripcionController = new InscripcionController();
                const parcialController = new ParcialController();
                const finalController = new FinalController();
                // const facultad = (await facultadController.getAll())[0];
                const carreraTemp = new Carrera(info.info_rendimiento.carrera);
                // carreraTemp.facultad = facultad;
                const carrera = await carreraController.gestionar(carreraTemp);

                this.guardarMateriasCursadas(carrera, info.info_calificaciones);
                let alumno = new Perfil({ vista_info_consultor: info });
                alumno = await perfilController.gestionar(alumno);
                this.guardarExtension(alumno, info.info_extensiones);

                let periodo: undefined | Periodo;

                for (const inscripcion of info.info_inscripciones) {
                    const dataParciales = info.info_parciales.find(value => value.materia.includes(inscripcion.materia))!;

                    if (!periodo || formatearFecha(periodo.fecha_inscripcion) !== inscripcion.fecha_inscripto) {
                        periodo = await periodoController.gestionar(new Periodo(inscripcion));
                    }

                    const materia = await materiaController.gestionar(new Materia(inscripcion.materia));

                    const materiaCarrera = await materiaCarreraController.gestionar(
                        new MateriaCarrera({ carrera, materia, semestre: getMateria(inscripcion.materia).semestre ?? 0 })
                    );

                    const escala = await escalaController.gestionar(new Escala(dataParciales.evaluacion));

                    const inscripcionTemp = new Inscripcion(inscripcion);
                    inscripcionTemp.perfil = alumno;
                    inscripcionTemp.periodo = periodo;
                    inscripcionTemp.escala = escala;
                    inscripcionTemp.materiaCarrera = materiaCarrera;
                    logger.debug('antes de registrar la inscripcion')
                    const inscripcionData = await inscripcionController.gestionar(inscripcionTemp);
                    logger.debug('despues de registrar la inscripcion')
                    const parcial = new ResultadoParcial(dataParciales);
                    parcial.inscripcion = inscripcionData;
                    await parcialController.gestionar(parcial);

                    for (const final of info.info_finales) {
                        const finalTemp = new ExamenFinal(final);
                        finalTemp.inscripcion = inscripcionData;
                        await finalController.gestionar(finalTemp);
                    }

                }
            });
        } catch (error) {
            console.error(error)
        }

    }

    private async guardarExtension(perfil: Perfil, extensiones: info_extension[], tx = AppDataSource) {
        const extensionController = new ExtensionController(tx);
        const perfilExtensionController = new PerfilExtensionController(tx);

        const extensionesCorregidas = [...extensiones];
        extensionesCorregidas.pop();

        for (const extension of extensionesCorregidas) {
            try {
                const extensionNuevo = await extensionController.gestionar(new Extension(extension));
                if (extensionNuevo) {
                    const { horas, cantidad } = extension;
                    const perfilExtension = new PerfilExtension();
                    perfilExtension.extension = extensionNuevo;
                    perfilExtension.cantidad = cantidad ? Number(cantidad) : 0;
                    perfilExtension.horas = horas ? Number(horas) : 0;
                    perfilExtension.perfil = perfil;
                    await perfilExtensionController.gestionar(perfilExtension);
                }
            } catch (error) {
                logger.warn('Ocurrió un error y no se pudo registrar una extension', error);
            }
        }

    }

    private async guardarMateriasCursadas(carrera: Carrera, info_calificaciones: info_calificaciones[], tx = AppDataSource) {
        const materiaController = new MateriaController(tx);
        const materiaCarreraController = new MateriaCarreraController(tx);

        const res: MateriaCarrera[] = [];
        for (const data of info_calificaciones) {
            try {
                const materia = await materiaController.gestionar(new Materia(data.materia));
                if (materia) {
                    res.push(await materiaCarreraController.gestionar(
                        new MateriaCarrera({ carrera, materia, semestre: data.semestre })
                    ));
                }
            } catch {
                logger.warn('Ocurrió un error y no se pudo registrar una materia');
            }
        }

        return res
    }
}
