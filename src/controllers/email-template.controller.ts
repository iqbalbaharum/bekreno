import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {EmailTemplate} from '../models';
import {EmailTemplateRepository} from '../repositories';

export class EmailTemplateController {
  constructor(
    @repository(EmailTemplateRepository)
    public emailTemplateRepository : EmailTemplateRepository,
  ) {}

  @post('/email-templates', {
    responses: {
      '200': {
        description: 'EmailTemplate model instance',
        content: {'application/json': {schema: getModelSchemaRef(EmailTemplate)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EmailTemplate, {
            title: 'NewEmailTemplate',
            exclude: ['uuid'],
          }),
        },
      },
    })
    emailTemplate: Omit<EmailTemplate, 'uuid'>,
  ): Promise<EmailTemplate> {
    return this.emailTemplateRepository.create(emailTemplate);
  }

  @get('/email-templates/count', {
    responses: {
      '200': {
        description: 'EmailTemplate model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(EmailTemplate) where?: Where<EmailTemplate>,
  ): Promise<Count> {
    return this.emailTemplateRepository.count(where);
  }

  @get('/email-templates', {
    responses: {
      '200': {
        description: 'Array of EmailTemplate model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(EmailTemplate, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(EmailTemplate) filter?: Filter<EmailTemplate>,
  ): Promise<EmailTemplate[]> {
    return this.emailTemplateRepository.find(filter);
  }

  @patch('/email-templates', {
    responses: {
      '200': {
        description: 'EmailTemplate PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EmailTemplate, {partial: true}),
        },
      },
    })
    emailTemplate: EmailTemplate,
    @param.where(EmailTemplate) where?: Where<EmailTemplate>,
  ): Promise<Count> {
    return this.emailTemplateRepository.updateAll(emailTemplate, where);
  }

  @get('/email-templates/{id}', {
    responses: {
      '200': {
        description: 'EmailTemplate model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(EmailTemplate, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(EmailTemplate, {exclude: 'where'}) filter?: FilterExcludingWhere<EmailTemplate>
  ): Promise<EmailTemplate> {
    return this.emailTemplateRepository.findById(id, filter);
  }

  @patch('/email-templates/{id}', {
    responses: {
      '204': {
        description: 'EmailTemplate PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EmailTemplate, {partial: true}),
        },
      },
    })
    emailTemplate: EmailTemplate,
  ): Promise<void> {
    await this.emailTemplateRepository.updateById(id, emailTemplate);
  }

  @put('/email-templates/{id}', {
    responses: {
      '204': {
        description: 'EmailTemplate PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() emailTemplate: EmailTemplate,
  ): Promise<void> {
    await this.emailTemplateRepository.replaceById(id, emailTemplate);
  }

  @del('/email-templates/{id}', {
    responses: {
      '204': {
        description: 'EmailTemplate DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.emailTemplateRepository.deleteById(id);
  }
}
