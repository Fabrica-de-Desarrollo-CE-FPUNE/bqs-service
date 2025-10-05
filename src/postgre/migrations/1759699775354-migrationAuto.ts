import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationAuto1759699775354 implements MigrationInterface {
    name = 'MigrationAuto1759699775354'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "materia" ("id" SERIAL NOT NULL, "nombre" character varying(35) NOT NULL, CONSTRAINT "PK_a8b21a045c6a7d9cfffc3a2ab26" PRIMARY KEY ("id")); COMMENT ON COLUMN "materia"."id" IS 'Id y Clave Primaria de la tabla en cuestión.'; COMMENT ON COLUMN "materia"."nombre" IS 'Se debe nombrar obligatoriamente para la tabla en cuestión.'`);
        await queryRunner.query(`CREATE TABLE "resultado_parcial" ("id" SERIAL NOT NULL, "inscripcionId" integer, "tuPrimeraparcial" integer NOT NULL, "tuSegundaparcial" integer NOT NULL, "tuTrabajopractico" integer NOT NULL, "tuTrabajolaboratorio" integer NOT NULL, CONSTRAINT "REL_313a2480eb0a80a449c4416466" UNIQUE ("inscripcionId"), CONSTRAINT "PK_3a41ce6bfe1e37940ebabf9c5c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "periodo" ("id" SERIAL NOT NULL, "fechaInscripcion" date NOT NULL, "fechaVigencia" date NOT NULL, CONSTRAINT "PK_7a8fb04e141b549da1311059257" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "examen_final" ("id" SERIAL NOT NULL, "fecha" date NOT NULL, "resultado" integer, CONSTRAINT "PK_0dbc68a86d4c78d23bf1599857a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "escala" ("id" SERIAL NOT NULL, "nombre" character varying(35) NOT NULL, "maxPrimeraparcial" integer NOT NULL, "maxSegundaparcial" integer NOT NULL, "maxTrabajopractico" integer NOT NULL, "maxTrabajolaboratorio" integer NOT NULL, CONSTRAINT "PK_ca34d547f4f640b2dcdfcffca2f" PRIMARY KEY ("id")); COMMENT ON COLUMN "escala"."id" IS 'Id y Clave Primaria de la tabla en cuestión.'; COMMENT ON COLUMN "escala"."nombre" IS 'Se debe nombrar obligatoriamente para la tabla en cuestión.'`);
        await queryRunner.query(`CREATE TABLE "inscripcion" ("id" SERIAL NOT NULL, "usuarioId" integer NOT NULL, "materiaId" integer NOT NULL, "grupo" character NOT NULL, "escalaId" integer, CONSTRAINT "PK_bdff6201e066cec231d770912bb" PRIMARY KEY ("id")); COMMENT ON COLUMN "inscripcion"."escalaId" IS 'Id y Clave Primaria de la tabla en cuestión.'`);
        await queryRunner.query(`CREATE TABLE "usuario" ("id" SERIAL NOT NULL, "nombre" character varying(35) NOT NULL, "cedulaIdentidad" character varying(12) NOT NULL, "celular" character varying(15), "telefonoParticular" character varying(15), "email" character varying(30), CONSTRAINT "UQ_121cc9a8edc58e21a9e0bc95e61" UNIQUE ("cedulaIdentidad"), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id")); COMMENT ON COLUMN "usuario"."id" IS 'Id y Clave Primaria de la tabla en cuestión.'; COMMENT ON COLUMN "usuario"."nombre" IS 'Se debe nombrar obligatoriamente para la tabla en cuestión.'`);
        await queryRunner.query(`CREATE TABLE "inscripcion_periodos_periodo" ("inscripcionId" integer NOT NULL, "periodoId" integer NOT NULL, CONSTRAINT "PK_2454262df2709879281d43d4a18" PRIMARY KEY ("inscripcionId", "periodoId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f22b3af03f5b9c9b97815326b6" ON "inscripcion_periodos_periodo" ("inscripcionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d32877cdaecb60bd6d33b86cb8" ON "inscripcion_periodos_periodo" ("periodoId") `);
        await queryRunner.query(`ALTER TABLE "resultado_parcial" ADD CONSTRAINT "FK_313a2480eb0a80a449c4416466e" FOREIGN KEY ("inscripcionId") REFERENCES "inscripcion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscripcion" ADD CONSTRAINT "FK_22d61b85ae419744e28f5858d3a" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscripcion" ADD CONSTRAINT "FK_c85979aba6a3d7c434348187474" FOREIGN KEY ("materiaId") REFERENCES "materia"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscripcion" ADD CONSTRAINT "FK_65e7d50de64bb2f654c6d08f6fc" FOREIGN KEY ("escalaId") REFERENCES "escala"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inscripcion_periodos_periodo" ADD CONSTRAINT "FK_f22b3af03f5b9c9b97815326b60" FOREIGN KEY ("inscripcionId") REFERENCES "inscripcion"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "inscripcion_periodos_periodo" ADD CONSTRAINT "FK_d32877cdaecb60bd6d33b86cb88" FOREIGN KEY ("periodoId") REFERENCES "periodo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TABLE "query-result-cache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "query-result-cache"`);
        await queryRunner.query(`ALTER TABLE "inscripcion_periodos_periodo" DROP CONSTRAINT "FK_d32877cdaecb60bd6d33b86cb88"`);
        await queryRunner.query(`ALTER TABLE "inscripcion_periodos_periodo" DROP CONSTRAINT "FK_f22b3af03f5b9c9b97815326b60"`);
        await queryRunner.query(`ALTER TABLE "inscripcion" DROP CONSTRAINT "FK_65e7d50de64bb2f654c6d08f6fc"`);
        await queryRunner.query(`ALTER TABLE "inscripcion" DROP CONSTRAINT "FK_c85979aba6a3d7c434348187474"`);
        await queryRunner.query(`ALTER TABLE "inscripcion" DROP CONSTRAINT "FK_22d61b85ae419744e28f5858d3a"`);
        await queryRunner.query(`ALTER TABLE "resultado_parcial" DROP CONSTRAINT "FK_313a2480eb0a80a449c4416466e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d32877cdaecb60bd6d33b86cb8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f22b3af03f5b9c9b97815326b6"`);
        await queryRunner.query(`DROP TABLE "inscripcion_periodos_periodo"`);
        await queryRunner.query(`DROP TABLE "usuario"`);
        await queryRunner.query(`DROP TABLE "inscripcion"`);
        await queryRunner.query(`DROP TABLE "escala"`);
        await queryRunner.query(`DROP TABLE "examen_final"`);
        await queryRunner.query(`DROP TABLE "periodo"`);
        await queryRunner.query(`DROP TABLE "resultado_parcial"`);
        await queryRunner.query(`DROP TABLE "materia"`);
    }

}
