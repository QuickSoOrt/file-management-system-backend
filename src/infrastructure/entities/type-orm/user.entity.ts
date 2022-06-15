import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
@Entity()
class User {
  @ObjectIdColumn()
  public _id: ObjectID;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  public password: string;
}

export default User;
