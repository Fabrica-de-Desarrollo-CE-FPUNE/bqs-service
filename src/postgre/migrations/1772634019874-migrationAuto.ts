import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationAuto1772634019874 implements MigrationInterface {
    name = 'MigrationAuto1772634019874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "perfil" ADD "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "perfil" ADD "fecha_actualizacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "perfil" DROP COLUMN "fecha_actualizacion"`);
        await queryRunner.query(`ALTER TABLE "perfil" DROP COLUMN "fecha_creacion"`);
    }

}
