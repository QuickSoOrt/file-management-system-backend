import { Binary } from 'mongodb';

export interface IFsService {
  createFile(path: string, IV: Binary, content: Buffer): Promise<void>;
}
