import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ObjectID } from 'mongodb';

export class CreateFolderRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly folderName: string;

  readonly parentFolderId?: ObjectID;
}
