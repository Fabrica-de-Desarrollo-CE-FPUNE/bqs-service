
import logger from '../../log/logger';
import { info_calificaciones } from '../../types/ConsultorEstudiante.types';
import { vista_info_consultor } from '../../types/ConsultorEstudianteVistas.types';
import { formatearFecha, getMateria } from '../../utils/dataUtil';
import { Carrera } from '../entity/Carrera';
import { Escala } from '../entity/Escala';
import { ExamenFinal } from '../entity/ExamenFinal';
import { Inscripcion } from '../entity/Inscripcion';
import { Materia } from '../entity/Materia';
import { MateriaCarrera } from '../entity/MateriaCarrera';
import { Perfil } from '../entity/Perfil';
import { Periodo } from '../entity/Periodo';
import { ResultadoParcial } from '../entity/ResultadoParcial';
import { Usuario } from '../entity/Usuario';
import { CarreraController } from './CarreraController';
import { EscalaController } from './EscalaController';
import { FacultadController } from './FacultadController';
import { FinalController } from './FinalController';
import { InscripcionController } from './InscripcionController';
import { MateriaCarreraController } from './MateriaCarreraController';
import { MateriaController } from './MateriaController';
import { ParcialController } from './ParcialController';
import { PerfilController } from './PerfilController';
import { PeriodoController } from './PeriodoController';

export class AlumnoController {

    private controllers: {
        carreraController: CarreraController,
        perfilController: PerfilController,
        facultadController: FacultadController,
        materiaController: MateriaController,
        inscripcionController: InscripcionController,
        periodoController: PeriodoController,
        escalaController: EscalaController,
        parcialController: ParcialController,
        finalController: FinalController,
        materiaCarreraController: MateriaCarreraController,
    }

    constructor() {
        this.controllers = {
            carreraController: new CarreraController(),
            perfilController: new PerfilController(),
            facultadController: new FacultadController(),
            materiaController: new MateriaController(),
            inscripcionController: new InscripcionController(),
            periodoController: new PeriodoController(),
            escalaController: new EscalaController(),
            parcialController: new ParcialController(),
            finalController: new FinalController(),
            materiaCarreraController: new MateriaCarreraController(),
        };
    }

    public async guardarAlumnoData(usuario: Usuario, info: vista_info_consultor) {

        try {
           // const facultad = (await this.controllers.facultadController.getAll())[0];
            const carreraTemp = new Carrera(info.info_rendimiento.carrera);
           // carreraTemp.facultad = facultad;
            const carrera = await this.controllers.carreraController.gestionar(carreraTemp);

            this.guardarMateriasCursadas(carrera, info.info_calificaciones);
            let alumno = new Perfil({ vista_info_consultor: info });
            alumno = await this.controllers.perfilController.gestionar(alumno);

            let periodo: undefined | Periodo;

            for (const inscripcion of info.info_inscripciones) {
                const dataParciales = info.info_parciales.find(value => value.materia.includes(inscripcion.materia))!;

                if (!periodo || formatearFecha(periodo.fecha_inscripcion) !== inscripcion.fecha_inscripto) {
                    periodo = await this.controllers.periodoController.gestionar(new Periodo(inscripcion));
                }

                const materia = await this.controllers.materiaController.gestionar(new Materia(inscripcion.materia));

                const materiaCarrera = await this.controllers.materiaCarreraController.gestionar(
                    new MateriaCarrera({ carrera, materia, semestre: getMateria(inscripcion.materia).semestre ?? 0 })
                );

                const escala = await this.controllers.escalaController.gestionar(new Escala(dataParciales.evaluacion));

                const inscripcionTemp = new Inscripcion(inscripcion);
                inscripcionTemp.perfil = alumno;
                inscripcionTemp.periodo = periodo;
                inscripcionTemp.escala = escala;
                inscripcionTemp.materiaCarrera = materiaCarrera;
                logger.debug('antes de registrar la inscripcion')
                const inscripcionData = await this.controllers.inscripcionController.gestionar(inscripcionTemp);
                logger.debug('despues de registrar la inscripcion')
                const parcial = new ResultadoParcial(dataParciales);
                parcial.inscripcion = inscripcionData;
                await this.controllers.parcialController.gestionar(parcial);

                for (const final of info.info_finales) {
                    const finalTemp = new ExamenFinal(final);
                    finalTemp.inscripcion = inscripcionData;
                    await this.controllers.finalController.gestionar(finalTemp);
                }



            }
        } catch (error) {
            console.error(error)
        }

    }

    private async guardarMateriasCursadas(carrera: Carrera, info_calificaciones: info_calificaciones[]) {
        const res: MateriaCarrera[] = [];
        for (const data of info_calificaciones) {
            try {
                const materia = await this.controllers.materiaController.gestionar(new Materia(data.materia));
                if (materia) {
                    res.push(await this.controllers.materiaCarreraController.gestionar(
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
