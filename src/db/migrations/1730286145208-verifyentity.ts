import { MigrationInterface, QueryRunner } from "typeorm";

export class Verifyentity1730286145208 implements MigrationInterface {
    name = 'Verifyentity1730286145208'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`verify\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_076d3a77ca71ace5e2d2d47cc9\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`verify\` ADD CONSTRAINT \`FK_076d3a77ca71ace5e2d2d47cc9d\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`verify\` DROP FOREIGN KEY \`FK_076d3a77ca71ace5e2d2d47cc9d\``);
        await queryRunner.query(`DROP INDEX \`REL_076d3a77ca71ace5e2d2d47cc9\` ON \`verify\``);
        await queryRunner.query(`DROP TABLE \`verify\``);
    }

}
