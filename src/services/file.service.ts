import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {FileDataSource} from '../datasources';
import {Container, File} from "../models";


export type Callback<T> = (err: Error | null, reply: T) => void;

export interface FileService {
  // container methods
  createContainer(container: Partial<Container>, cb: Callback<Container>): void;
  destroyContainer(containerName: string, cb: Callback<boolean>): void;
  getContainers(cb: Callback<Container[]>): void;
  getContainer(containerName: string, cb: Callback<Container>): void;
  // file methods
  getFiles(containerName: string, options: Object, cb: Callback<File[]>): void;
  getFile(containerName: string, fileName: string, cb: Callback<File>): void;
  removeFile(containerName: string, fileName: string, cb: Callback<boolean>): void;
  // main methods
  upload(containerName: string, req: any, res: any, options: Object, cb: Callback<any>): void;
  download(containerName: string, fileName: string, req: any, res: any, cb: Callback<any>): void;
}

export class FileServiceProvider
  implements Provider<FileService> {
  constructor(
    @inject('datasources.File')
    protected dataSource: FileDataSource = new FileDataSource(),
  ) {}

  value(): Promise<FileService> {
    return getService(this.dataSource);
  }
}
