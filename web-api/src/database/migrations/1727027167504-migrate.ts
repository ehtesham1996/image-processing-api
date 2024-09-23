import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrate1727027167504 implements MigrationInterface {
    name = 'Migrate1727027167504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "s3_url" character varying NOT NULL, "key" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "image_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "image_id" uuid, CONSTRAINT "PK_8efe9e629e663d96ddf0799ca10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "image_comments" ADD CONSTRAINT "FK_c69e90fee591d8bcb75b1a4bcc0" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "image_comments" DROP CONSTRAINT "FK_c69e90fee591d8bcb75b1a4bcc0"`);
        await queryRunner.query(`DROP TABLE "image_comments"`);
        await queryRunner.query(`DROP TABLE "image"`);
    }

}
