import { ApiProperty } from '@nestjs/swagger';
import { UserPresenter } from './user.presenter';

export class FilePresenter {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public folderId: string;

  @ApiProperty()
  public ownerId: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public mimetype: string;

  @ApiProperty()
  public size: number;

  @ApiProperty()
  public sharedWith: UserPresenter[];

  @ApiProperty()
  public createdAt: Date;

  @ApiProperty()
  public updatedAt: Date;
}
