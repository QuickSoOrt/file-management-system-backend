import { IsArray, IsNotEmpty } from 'class-validator';

export class ShareFolderRequestDto {
  @IsArray()
  @IsNotEmpty()
  usersToShareWith: string[];
}
