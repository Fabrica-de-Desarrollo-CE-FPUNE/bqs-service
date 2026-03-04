import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationAuto1765774646923 implements MigrationInterface {
    name = 'MigrationAuto1765774646923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "examen_final" ALTER COLUMN "final" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "examen_final" ALTER COLUMN "final" SET NOT NULL`);
    }

}
