import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';
import { AccessType } from '../../../domain/models/access-type.enum';
@Entity()
class FolderPermission {
  @ObjectIdColumn()
  public _id: ObjectID;

  @Column()
  public folderId: ObjectID;

  @Column()
  public userId: ObjectID;

  @Column()
  public accessType: AccessType;
}

export default FolderPermission;
