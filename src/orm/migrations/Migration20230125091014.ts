import { Migration } from '@mikro-orm/migrations';

export class Migration20230125091014 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `message` add `chat_id` varchar(255) not null, add `author_id` varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `message` drop `chat_id`;');
    this.addSql('alter table `message` drop `author_id`;');
  }

}
