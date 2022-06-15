import { ApiProperty } from '@nestjs/swagger';
import { UserPresenter } from "./user.presenter";

export class FolderPresenter {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  parentId: string;

  @ApiProperty()
  ownerId: string;

  @ApiProperty()
  sharedWith: UserPresenter[];
}
