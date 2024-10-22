import "reflect-metadata"
import { DataSource } from "typeorm"
import { Usuario } from "./entity/Usuario"
import { Materia } from "./entity/Materia"
import { Inscripcion } from "./entity/Inscripcion"
import { Periodo } from "./entity/Periodo"

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
    entities: [Usuario, Materia, Periodo, Inscripcion],
    migrations: [],
    subscribers: [],
})
