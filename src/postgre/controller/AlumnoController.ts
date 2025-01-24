import { UsuarioController } from "./UsuarioController";
import { PerfilController } from "./PerfilController";
import { MateriaController } from "./MateriaController";
import { InscripcionController } from "./InscripcionController";
import { PeriodoController } from "./PeriodoController";
import { EscalaController } from "./EscalaController";
import { ParcialController } from "./ParcialController";
import { FinalController } from "./FinalController";
import { Alumno_credencial_login } from "../../types/ConsultorEstudianteCredenciales.types";
import { vista_info_consultor } from "../../types/ConsultorEstudianteVistas.types";
import { formatearFecha } from "../../utils/dataUtil";
import { Materia } from "../entity/Materia";
import { Usuario } from "../entity/Usuario";

export class AlumnoController {
    private usuarioController: UsuarioController;
    private perfilController: PerfilController;
    private materiaController: MateriaController;
    private inscripcionController: InscripcionController;
    private periodoController: PeriodoController;
    private escalaController: EscalaController;
    private parcialController: ParcialController;
    private finalController: FinalController;

    constructor() {
        this.usuarioController = new UsuarioController();
        this.perfilController = new PerfilController();
        this.materiaController = new MateriaController();
        this.inscripcionController = new InscripcionController();
        this.periodoController = new PeriodoController();
        this.escalaController = new EscalaController();
        this.parcialController = new ParcialController();
        this.finalController = new FinalController();
    }

    public async guardarAlumnoData(usuario:Usuario, info: vista_info_consultor) {
        
        const alumno = await this.perfilController.gestionarPerfil(usuario, info);

        let periodo;

        for (const inscripcion of info.info_inscripciones) {
            const dataParciales = info.info_parciales.find(value => value.materia.includes(inscripcion.materia))!;

            if (!periodo || (formatearFecha(periodo.fechaInscripcion) !== inscripcion.fecha_inscripto)) {
                periodo = await this.periodoController.gestionarPeriodo(inscripcion);
            }

            const materia = await this.materiaController.gestionarMateria(new Materia(inscripcion.materia));
            const escala = await this.escalaController.gestionarEscala(dataParciales.evaluacion);

            const inscripcionData = await this.inscripcionController.gestionarInscripcion(inscripcion, alumno, materia, periodo, escala);
            await this.parcialController.gestionarParcial(inscripcionData, dataParciales);

            for (const final of info.info_finales) {
                await this.finalController.gestionarFinales(inscripcionData, final);
            }
        }
    }
}
