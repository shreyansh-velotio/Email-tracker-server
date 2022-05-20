import {MigrationInterface, QueryRunner} from "typeorm";

export class CronMigration1652950918042 implements MigrationInterface {
    name = 'CronMigration1652950918042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cron" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "cron" ADD "frequency" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cron" ADD "message" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cron" DROP CONSTRAINT "PK_2bd2e0a051c553ce710865305a1"`);
        await queryRunner.query(`ALTER TABLE "cron" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "cron" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cron" ADD CONSTRAINT "PK_2bd2e0a051c553ce710865305a1" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cron" DROP CONSTRAINT "PK_2bd2e0a051c553ce710865305a1"`);
        await queryRunner.query(`ALTER TABLE "cron" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "cron" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cron" ADD CONSTRAINT "PK_2bd2e0a051c553ce710865305a1" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "cron" DROP COLUMN "message"`);
        await queryRunner.query(`ALTER TABLE "cron" DROP COLUMN "frequency"`);
        await queryRunner.query(`ALTER TABLE "cron" ADD "name" character varying NOT NULL`);
    }

}
