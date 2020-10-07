import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Journal,
  Project,
} from '../models';
import {JournalRepository} from '../repositories';

export class JournalProjectController {
  constructor(
    @repository(JournalRepository)
    public journalRepository: JournalRepository,
  ) { }

  @get('/journals/{id}/project', {
    responses: {
      '200': {
        description: 'Project belonging to Journal',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          },
        },
      },
    },
  })
  async getProject(
    @param.path.string('id') id: typeof Journal.prototype.id,
  ): Promise<Project> {
    return this.journalRepository.project(id);
  }
}
