// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {Filter} from '@loopback/repository';
import {del, get, getFilterSchemaFor, param, post, Request, Response, RestBindings} from '@loopback/rest';
import {promisify} from 'util';
import {Container, File} from './../models';
import {FileService} from './../services';


export class FileController {
  constructor(
    @inject('services.FileService') protected fileService: FileService,
    @inject(RestBindings.Http.REQUEST) public request: Request,
    @inject(RestBindings.Http.RESPONSE) public response: Response
  ) {}

  @get(`/containers/files`, {
    responses: {
      '200': {
        description: 'Array of Files model instances belongs to container',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': File } },
          },
        },
      },
    },
  })
  async findFilesInContainer(
    @param.query.object('filter', getFilterSchemaFor(Container)) filter?: Filter
    ): Promise<File[]> {
    const getFiles = promisify(this.fileService.getFiles);
    return getFiles(`${process.env.STORAGE_CONTAINER}`, {});
  }

  @get('/containers/files/{fileName}', {
    responses: {
      '200': {
        description: 'File model instances belongs to container',
        content: { 'application/json': { schema: { 'x-ts-type': File } } },
      },
    },
  })
  async findFileInContainer(
    @param.path.string('fileName') fileName: string): Promise<File> {
    const getFile = promisify(this.fileService.getFile);
    return getFile(`${process.env.STORAGE_CONTAINER}`, fileName);
  }

  @del('/containers/files/{fileName}', {
    responses: {
      '204': {
        description: 'File DELETE from Container success',
      },
    },
  })
  async deleteFileInContainer(
    @param.path.string('fileName') fileName: string): Promise<boolean> {
    const removeFile = promisify(this.fileService.removeFile);
    return removeFile(`${process.env.STORAGE_CONTAINER}`, fileName);
  }

  @post(`/containers/upload`, {
    responses: {
      '200': {
        description: 'Upload a Files model instances into Container',
        content: { 'application/json': { schema: { 'x-ts-type': File } } },
      },
    },
  })
  async upload(): Promise<File> {
    const upload = promisify(this.fileService.upload);
    return upload(`${process.env.STORAGE_CONTAINER}`, this.request, this.response, {});
  }

  @get('/containers//download/{fileName}', {
    responses: {
      '200': {
        description: 'Download a File within specified Container',
        content: { 'application/json': { schema: { 'x-ts-type': Object } } },
      },
    },
  })
  async download(
    @param.path.string('fileName') fileName: string): Promise<any> {
    const download = promisify(this.fileService.download);
    return download(`${process.env.STORAGE_CONTAINER}`, fileName, this.request, this.response);
  }
}
