// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {Filter} from '@loopback/repository';
import {del, get, getFilterSchemaFor, param, post, Request, requestBody, Response, RestBindings} from '@loopback/rest';
import {promisify} from 'util';
import {Container, File} from './../models';
import {FileService} from './../services';


export class FileController {
  constructor(
    @inject('services.FileService') protected fileService: FileService,
    @inject(RestBindings.Http.REQUEST) public request: Request,
    @inject(RestBindings.Http.RESPONSE) public response: Response
  ) {}

  @post('/containers', {
    responses: {
      '200': {
        description: 'Container model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Container } } },
      },
    },
  })
  async createContainer(@requestBody() container: Container): Promise<Container> {
    const createContainer = promisify(this.fileService.createContainer);
    return createContainer(container)
  }

  @get('/containers', {
    responses: {
      '200': {
        description: 'Array of Containers model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': Container } },
          },
        },
      },
    },
  })
  async findContainer(@param.query.object('filter', getFilterSchemaFor(Container)) filter?: Filter): Promise<Container[]> {
    const getContainers = promisify(this.fileService.getContainers);
    return getContainers();
  }

  @get('/containers/{containerName}', {
    responses: {
      '200': {
        description: 'Container model instance',
        content: { 'application/json': { schema: { 'x-ts-type': Container } } },
      },
    },
  })
  async findContainerByName(@param.path.string('containerName') containerName: string): Promise<Container> {
    const getContainer = promisify(this.fileService.getContainer);
    return getContainer(containerName);
  }

  @del('/containers/{containerName}', {
    responses: {
      '204': {
        description: 'Container DELETE success',
      },
    },
  })
  async deleteContainerByName(@param.path.string('containerName') containerName: string): Promise<boolean> {
    const destroyContainer = promisify(this.fileService.destroyContainer);
    return destroyContainer(containerName);
  }

  @get('/containers/{containerName}/files', {
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
  async findFilesInContainer(@param.path.string('containerName') containerName: string,
    @param.query.object('filter', getFilterSchemaFor(Container)) filter?: Filter): Promise<File[]> {
    const getFiles = promisify(this.fileService.getFiles);
    return getFiles(containerName, {});
  }

  @get('/containers/{containerName}/files/{fileName}', {
    responses: {
      '200': {
        description: 'File model instances belongs to container',
        content: { 'application/json': { schema: { 'x-ts-type': File } } },
      },
    },
  })
  async findFileInContainer(@param.path.string('containerName') containerName: string,
    @param.path.string('fileName') fileName: string): Promise<File> {
    const getFile = promisify(this.fileService.getFile);
    return getFile(containerName, fileName);
  }

  @del('/containers/{containerName}/files/{fileName}', {
    responses: {
      '204': {
        description: 'File DELETE from Container success',
      },
    },
  })
  async deleteFileInContainer(@param.path.string('containerName') containerName: string,
    @param.path.string('fileName') fileName: string): Promise<boolean> {
    const removeFile = promisify(this.fileService.removeFile);
    return removeFile(containerName, fileName);
  }

  @post('/containers/{containerName}/upload', {
    responses: {
      '200': {
        description: 'Upload a Files model instances into Container',
        content: { 'application/json': { schema: { 'x-ts-type': File } } },
      },
    },
  })
  async upload(
    @param.path.string('containerName') containerName: string
  ): Promise<File> {
    const upload = promisify(this.fileService.upload);
    return upload(containerName, this.request, this.response, {});
  }

  @get('/containers/{containerName}/download/{fileName}', {
    responses: {
      '200': {
        description: 'Download a File within specified Container',
        content: { 'application/json': { schema: { 'x-ts-type': Object } } },
      },
    },
  })
  async download(@param.path.string('containerName') containerName: string,
    @param.path.string('fileName') fileName: string): Promise<any> {
    const download = promisify(this.fileService.download);
    return download(containerName, fileName, this.request, this.response);
  }
}
