import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSharedFolderRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly folderName: string;

  @IsString()
  @IsNotEmpty()
  readonly parentFolderId?: string;
}
