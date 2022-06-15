import { IsArray, IsNotEmpty } from 'class-validator';

export class UnshareFileRequestDto {
  @IsArray()
  @IsNotEmpty()
  usersToUnshareWith: string[];
}
