import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  Response,
  RestBindings,
} from '@loopback/rest';
import {User} from '../models';
import {CredentialRepository, UserRepository} from '../repositories';
import {CredentialSchema} from '../schema';
import {OtpService, SmsTac, XmlToJsonService} from '../services';
import {Credentials} from '../types/credential.types';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(CredentialRepository)
    public credentialRepository: CredentialRepository,
    @inject('services.SmsTac') protected smsTacService: SmsTac,
    @inject('services.XmlToJsonService')
    protected xmlToJsonService: XmlToJsonService,
    @inject('services.OtpService') protected otp: OtpService,
  ) {}

  @post('/user', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @requestBody({
      required: true,
      content: {
        'application/x-www-form-urlencoded': {schema: CredentialSchema},
      },
    })
    credentials: Credentials,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<User> {
    const userExisted = await this.userRepository.findOne({
      where: {mobile: credentials.mobile},
    });

    if (!userExisted) {
      const userCreated = await this.userRepository.create({
        mobile: credentials.mobile,
        email: credentials.email,
        name: credentials.name,
      });

      const token = this.otp.getOTPCode();

      await this.credentialRepository.create({
        password: credentials.password,
        token: token,
        userId: userCreated.uuid,
      });

      // send SMS
      const validity: string = process.env.OTP_VALIDITY ?? '0';
      await this.smsTacService.sendSms(
        credentials.mobile,
        `Your verification token is ${token}. Only valid for ${
          parseInt(validity) / 60000
        } minute.`,
        `${token}`,
      );

      return userCreated;
    } else {
      throw new HttpErrors.BadRequest('This email already exists');
    }
  }

  @get('/user/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/user', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/user', {
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/user/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/user/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/user/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/user/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
