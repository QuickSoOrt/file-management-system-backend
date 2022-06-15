export enum ErrorMessage {
  PASSWORD_TOO_WEAK = 'Password should contain at least one upper case letter, one lower case letter and one digit or special character',
  USER_ALREADY_REGISTERED = 'User already registered',
  USERNAME_ALREADY_TAKEN = 'Username already taken',
  INVALID_CREDENTIALS_PROVIDED = 'Wrong credentials provided',
  USER_NOT_FOUND = 'User with id %s not found',
  FOLDER_NOT_FOUND = 'Folder with id %s not found',
  PARENT_FOLDER_NOT_FOUND = 'Parent folder with id %s not found',
  FILE_UPLOAD_ERROR = 'Could not upload file with name %s',
  FILE_ALREADY_EXISTS = 'File with name %s already exists',
  FOLDER_ALREADY_EXISTS = 'Folder with name %s already exists',
  FILE_NOT_FOUND = 'File with id %s not found',
  INVALID_FOLDER_ACCESS_PERMISSION = "You don't have permission to access this folder",
}
