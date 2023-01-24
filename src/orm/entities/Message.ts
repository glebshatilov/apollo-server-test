import { Entity, Property, PrimaryKey } from '@mikro-orm/core'

@Entity()
export class Message {
  @PrimaryKey()
  id!: string

  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  @Property()
  text!: string

}
