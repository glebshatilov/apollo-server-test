import { Migration } from '@mikro-orm/migrations';

export class Migration20230124052902 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `message` (`id` varchar(255) not null, `created_at` datetime not null, `updated_at` datetime not null, `text` varchar(255) not null, primary key (`id`)) default character set utf8mb4 engine = InnoDB;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists `message`;');
  }

}
