import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationAuto1767392233902 implements MigrationInterface {
    name = 'MigrationAuto1767392233902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "calificaciones" ("id" SERIAL NOT NULL, "nota" character varying NOT NULL, "acta" integer NOT NULL, "fecha" date NOT NULL, "materia_id" integer, "perfil_id" integer, CONSTRAINT "PK_45fac93d6e61f7cd3b4f28020b0" PRIMARY KEY ("id")); COMMENT ON COLUMN "calificaciones"."materia_id" IS 'Id y Clave Primaria de la tabla en cuestión.'; COMMENT ON COLUMN "calificaciones"."perfil_id" IS 'Id y Clave Primaria de la tabla en cuestión.'`);
        await queryRunner.query(`ALTER TABLE "calificaciones" ADD CONSTRAINT "FK_c71c4e8b3f214c32c81b5a8b101" FOREIGN KEY ("materia_id") REFERENCES "materia"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calificaciones" ADD CONSTRAINT "FK_a102d095db31c09f3b4ec673313" FOREIGN KEY ("perfil_id") REFERENCES "perfil"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calificaciones" DROP CONSTRAINT "FK_a102d095db31c09f3b4ec673313"`);
        await queryRunner.query(`ALTER TABLE "calificaciones" DROP CONSTRAINT "FK_c71c4e8b3f214c32c81b5a8b101"`);
        await queryRunner.query(`DROP TABLE "calificaciones"`);
    }

}
