import "reflect-metadata"
import { DataSource } from "typeorm"
import { Usuario } from "./entity/Usuario"
import { Materia } from "./entity/Materia"
import { Inscripcion } from "./entity/Inscripcion"
import { Periodo } from "./entity/Periodo"
import { Escala } from "./entity/Escala"
import { ResultadoParcial } from "./entity/ResultadoParcial"
import { ExamenFinal } from "./entity/ExamenFinal"
import * as dotenv from "dotenv"

dotenv.config({path:'.env'});

export const AppDataSource = new DataSource({
    cache:true,
    type: "postgres",
    host: process.env.HOST,
    port: Number(process.env.PORT_DB),
    username: process.env.USERNAME_DB,
    password: process.env.PASSWORD,
    database: process.env.DB,
    synchronize: true, // Borra toda la base de datos cada que arranca, cuidado con este en produccion
    logging: false,
    entities: [Usuario, Materia, Periodo, Inscripcion, Escala, ResultadoParcial, ExamenFinal],
    migrations: [],
    subscribers: [],
})
