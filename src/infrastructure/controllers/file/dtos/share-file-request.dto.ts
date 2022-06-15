import { IsArray, IsNotEmpty } from 'class-validator';

export class ShareFileRequestDto {
  @IsArray()
  @IsNotEmpty()
  usersToShareWith: string[];
}
