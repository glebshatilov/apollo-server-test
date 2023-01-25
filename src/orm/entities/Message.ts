import { Entity, Property, PrimaryKey } from '@mikro-orm/core'

@Entity()
export class Message {
  @PrimaryKey()
  id!: number

  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  @Property()
  text!: string

  @Property()
  chatId!: string

  @Property()
  authorId!: string
}
