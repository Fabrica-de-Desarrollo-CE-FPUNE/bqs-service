import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    
    type: "postgres",
    host: process.env.HOST_DB ?? "localhost",
    port: Number(process.env.PORT_DB!),
    username: process.env.USERNAME_DB!,
    password: process.env.PASSWORD_DB!,
    database: process.env.DATABASE!,
    synchronize: Boolean(process.env.SYNCHRONIZE_DB!),
    logging: process.env.NODE_ENV !== 'production',
     entities: [
        process.env.NODE_ENV === 'production'
            ? 'dist/postgre/entity/**/*.js'
            : 'src/postgre/entity/**/*.ts'
    ],
    migrations: [
        process.env.NODE_ENV === 'production'
            ? 'dist/postgre/migrations/**/*.js'
            : 'src/postgre/migrations/**/*.ts'
    ],
    migrationsTableName: "migrations",
    subscribers: [],
});

AppDataSource.initialize();
