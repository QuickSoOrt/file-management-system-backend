import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';
@Entity()
class File {
  @ObjectIdColumn()
  public _id: ObjectID;

  @Column()
  public folderId: ObjectID;

  @Column()
  public ownerId: ObjectID;

  @Column()
  public name: string;

  @Column()
  public path: string;

  @Column()
  public size: number;
}

export default File;
