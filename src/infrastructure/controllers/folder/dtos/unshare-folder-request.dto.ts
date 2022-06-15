import { IsArray, IsNotEmpty } from 'class-validator';

export class UnshareFolderRequestDto {
  @IsArray()
  @IsNotEmpty()
  usersToUnshareWith: string[];
}
