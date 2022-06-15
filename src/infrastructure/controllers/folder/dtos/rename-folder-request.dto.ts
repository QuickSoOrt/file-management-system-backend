import { IsNotEmpty, IsString } from 'class-validator';

export class RenameFolderRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly newName: string;
}
