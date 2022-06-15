import { IsNotEmpty, IsString } from 'class-validator';

export class RenameFileRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly newName: string;
}
