import { Migration } from '@mikro-orm/migrations';

export class Migration20230125100336 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `message` modify `id` int unsigned not null auto_increment;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `message` modify `id` varchar(255) not null;');
  }

}
