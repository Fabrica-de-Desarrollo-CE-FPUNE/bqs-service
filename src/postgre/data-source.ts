import "reflect-metadata"
import { DataSource } from "typeorm"
import { Usuario } from "./entity/Usuario"
import { Materia } from "./entity/Materia"
import { Inscripcion } from "./entity/Inscripcion"
import { Periodo } from "./entity/Periodo"
import { Escala } from "./entity/Escala"
import { ResultadoParcial } from "./entity/ResultadoParcial"
import { ExamenFinal } from "./entity/ExamenFinal"

export const AppDataSource = new DataSource({
    cache:true,
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "root",
    database: "control-extension-db",
    synchronize: true,
    logging: false,
    entities: [Usuario, Materia, Periodo, Inscripcion, Escala, ResultadoParcial, ExamenFinal],
    migrations: [],
    subscribers: [],
})
