import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';
@Entity()
class Folder {
  @ObjectIdColumn()
  public _id: ObjectID;

  @Column()
  public name: string;

  @Column()
  public parent: ObjectID;

  @Column()
  public ownerId: ObjectID;
}

export default Folder;
