import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAttendanceTabless1730067002406 implements MigrationInterface {
    name = 'CreateAttendanceTabless1730067002406'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`attendance\` (\`id\` int NOT NULL AUTO_INCREMENT, \`arrival_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`leave_time\` timestamp NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`attendance\` ADD CONSTRAINT \`FK_466e85b813d871bfb693f443528\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`attendance\` DROP FOREIGN KEY \`FK_466e85b813d871bfb693f443528\``);
        await queryRunner.query(`DROP TABLE \`attendance\``);
    }

}
