import {TokenService, UserService} from '@loopback/authentication';
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
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings,
} from '../components/jwt-authentication/keys';
import {PasswordHasher} from '../components/jwt-authentication/services/hash.password.bcryptjs';
import {User} from '../models';
import {CredentialRepository, UserRepository} from '../repositories';
import {CredentialSchema, SignUpSchema} from '../schema';
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
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
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
        'application/x-www-form-urlencoded': {schema: SignUpSchema},
      },
    })
    credential: Credentials,
    @inject(RestBindings.Http.RESPONSE) response: Response,
  ): Promise<User> {
    const userExisted = await this.userRepository.findOne({
      where: {mobile: credential.mobile},
    });

    if (!userExisted) {
      const userCreated = await this.userRepository.create({
        mobile: credential.mobile,
        email: credential.email,
        name: credential.name,
      });

      const token = this.otp.getOTPCode();

      await this.credentialRepository.create({
        password: await this.passwordHasher.hashPassword(credential.password),
        token: token,
        userId: userCreated.uuid,
      });

      // send SMS
      const validity: string = process.env.OTP_VALIDITY ?? '0';
      await this.smsTacService.sendSms(
        credential.mobile,
        `Your verification token is ${token}. Only valid for ${
          parseInt(validity) / 60000
        } minute.`,
        `${token}`,
      );

      return userCreated;
    } else {
      throw new HttpErrors.BadRequest('This mobile already exists');
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

  @post('/user/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      required: true,
      content: {
        'application/x-www-form-urlencoded': {schema: CredentialSchema},
      },
    })
    credential: Credentials,
  ): Promise<string> {
    const user = await this.userService.verifyCredentials(credential);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);

    return token;
  }
}
