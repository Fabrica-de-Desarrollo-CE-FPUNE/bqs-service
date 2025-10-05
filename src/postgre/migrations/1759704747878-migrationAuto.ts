import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationAuto1759704747878 implements MigrationInterface {
    name = 'MigrationAuto1759704747878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "perfil" DROP CONSTRAINT "FK_98ee297aeb0462f198211eb02e5"`);
        await queryRunner.query(`ALTER TABLE "perfil" DROP CONSTRAINT "REL_98ee297aeb0462f198211eb02e"`);
        await queryRunner.query(`ALTER TABLE "perfil" DROP COLUMN "usuario_id"`);
        await queryRunner.query(`ALTER TABLE "perfil" ADD "usuario_id" uuid`);
        await queryRunner.query(`ALTER TABLE "perfil" ADD CONSTRAINT "UQ_98ee297aeb0462f198211eb02e5" UNIQUE ("usuario_id")`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "perfil" ADD CONSTRAINT "FK_98ee297aeb0462f198211eb02e5" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "perfil" DROP CONSTRAINT "FK_98ee297aeb0462f198211eb02e5"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2"`);
        await queryRunner.query(`ALTER TABLE "usuario" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "usuario" ADD CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "perfil" DROP CONSTRAINT "UQ_98ee297aeb0462f198211eb02e5"`);
        await queryRunner.query(`ALTER TABLE "perfil" DROP COLUMN "usuario_id"`);
        await queryRunner.query(`ALTER TABLE "perfil" ADD "usuario_id" integer`);
        await queryRunner.query(`ALTER TABLE "perfil" ADD CONSTRAINT "REL_98ee297aeb0462f198211eb02e" UNIQUE ("usuario_id")`);
        await queryRunner.query(`ALTER TABLE "perfil" ADD CONSTRAINT "FK_98ee297aeb0462f198211eb02e5" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
