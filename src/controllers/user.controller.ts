import {
  authenticate,
  AuthenticationBindings,
  UserService
} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {Getter, inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
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
  RestBindings
} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {
  PasswordHasherBindings,
  TokenServiceBindings,
  UserServiceBindings
} from '../components/jwt-authentication/keys';
import {JWTService} from '../components/jwt-authentication/services';
import {PasswordHasher} from '../components/jwt-authentication/services/hash.password.bcryptjs';
import {MyUserProfile} from '../components/jwt-authentication/types';
import {User} from '../models';
import {
  CredentialRepository,
  ProfileRepository,
  RoleRepository,
  SessionRepository,
  UserRepository
} from '../repositories';
import {CredentialSchema, OTPCredentialSchema, SignUpSchema} from '../schema';
import {ForgetPasswordSchema} from '../schema/forget-password.schema';
import {EmailService, OtpService, SmsTac, UserChannelService, XmlToJsonService} from '../services';
import {ForgetPassword, OTPCredential} from '../types';
import {Credentials} from '../types/credential.types';
import {OPERATION_SECURITY_SPEC} from './../components/jwt-authentication';

// ACL
const RESOURCE_NAME = 'user';
const ACL_PROJECT = {
  view: {
    resource: `${RESOURCE_NAME}*`,
    scopes: ['view'],
    allowedRoles: ['admin'],
  },
};

// END ACL

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(CredentialRepository)
    public credentialRepository: CredentialRepository,
    @repository(ProfileRepository)
    public profileRepository: ProfileRepository,
    @inject('services.SmsTac') protected smsTacService: SmsTac,
    @inject('services.XmlToJsonService')
    protected xmlToJsonService: XmlToJsonService,
    @inject('services.OtpService') protected otpService: OtpService,
    @inject('services.EmailService') protected emailService: EmailService,
    @inject('services.UserChannelService') protected userChannelService: UserChannelService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<UserProfile>,
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
    @repository(SessionRepository)
    public sessionRepository: SessionRepository,
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

      await this.credentialRepository.create({
        password: await this.passwordHasher.hashPassword(credential.password),
        userId: userCreated.uuid,
      });

      await this.profileRepository.create({
        userId: userCreated.uuid,
      });

      const roleUser = await this.roleRepository.findOne({
        where: {name: 'user'},
      });

      if (!roleUser) {
        throw new HttpErrors.BadRequest(
          'Invalid role data. Please reseed role with default value',
        );
      }

      await this.userRepository.roles(userCreated.uuid).link(roleUser.uuid);

      await this.emailService.sendEmailFromTemplate('WELCOMEMSG', { name: userCreated.name }, userCreated.email);
      await this.userChannelService.tagged(userCreated.uuid!, [
        'role.user'
      ])
      return userCreated;
    } else {
      throw new HttpErrors.BadRequest('This mobile already exists');
    }
  }
  @post('/user/admin/root', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async createAdminRoot(
    @requestBody({
      required: true,
      content: {
        'application/x-www-form-urlencoded': {schema: SignUpSchema},
      },
    })
    credential: Credentials,
  ): Promise<User> {
    if ((await this.userRepository.count()).count) {
      throw new HttpErrors.BadRequest(
        'Root admin can only be created when there no other user record',
      );
    }

    const roleMaster = await this.roleRepository.findOne({
      where: {name: 'master'},
    });

    if (!roleMaster) {
      throw new HttpErrors.BadRequest(
        'Invalid role data. Please reseed role with default value',
      );
    }

    const userCreated = await this.userRepository.create({
      mobile: credential.mobile,
      email: credential.email,
      name: credential.name,
    });

    await this.credentialRepository.create({
      password: await this.passwordHasher.hashPassword(credential.password),
      userId: userCreated.uuid,
    });

    await this.userRepository.roles(userCreated.uuid).link(roleMaster.uuid);

    return userCreated;
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
    security: OPERATION_SECURITY_SPEC,
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
  @authenticate('jwt')
  @authorize(ACL_PROJECT.view)
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
  ): Promise<{token: string}> {
    const user = await this.userService.verifyCredentials(credential);
    const session = await this.userRepository.sessions(user.uuid).create({});

    if (!session) {
      throw new HttpErrors.InternalServerError(
        'Error in creating user session.',
      );
    }

    const userProfile = this.userService.convertToUserProfile(
      user,
    ) as MyUserProfile;
    userProfile.session = session.uuid!;

    // TODO: Inclusionresolver in HasManyThrough is not implemented in loopback
    const roles = await this.userRepository.roles(user.uuid).find({
      fields: {
        name: true,
        createdAt: false,
        updatedAt: false,
        deletedAt: false,
      },
    });

    userProfile.roles = [];
    roles.forEach(role => {
      userProfile.roles.push(role.name);
    });
    // END TODO

    const token = await this.jwtService.generateToken(userProfile);

    return {token: token};
  }

  @post('/user/logout', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User logging out from the system',
      },
    },
  })
  @authenticate('jwt')
  async logout(): Promise<{result: string}> {
    const userProfile = await this.getCurrentUser();
    await this.sessionRepository.deleteById(userProfile.session);

    return {result: 'success'};
  }

  @get('/me', {
    security: OPERATION_SECURITY_SPEC,
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
  @authenticate('jwt')
  async whoAmI(): Promise<UserProfile> {
    return this.getCurrentUser();
  }

  @post('/user/verify', {
    responses: {
      '200': {
        description: 'User model instance',
      },
    },
  })
  @authenticate('jwt')
  async verifyOTPToken(
    @requestBody({
      required: true,
      content: {
        'application/x-www-form-urlencoded': {schema: OTPCredentialSchema},
      },
    })
    otpCredential: OTPCredential,
  ): Promise<User> {
    let bRetCode = false;

    const user = await this.getCurrentUser();
    const userCred = await this.userRepository.findCredentials(user.user);

    if (userCred?.tokenCreatedAt) {
      bRetCode = this.otpService.verifyOTP(
        otpCredential.otp,
        userCred.tokenCreatedAt,
      );
    }

    if (!bRetCode) {
      throw new HttpErrors.BadRequest('Invalid credentials');
    }

    return this.userRepository.findById(user.user);
  }

  @get('/user/forget/email/{email}', {
    responses: {
      '200': {
        description: 'Forget password',
      },
    },
  })
  async forgetPasswordByEmail(
    @param.path.string('email') userEmail: string,
  ): Promise<{result: Boolean}> {
    let bRetCode = false;
    const userExisted = await this.userRepository.findOne({
      where: {email: userEmail},
    });

    if (!userExisted) {
      throw new HttpErrors.Unauthorized('No valid users');
    } else {
      bRetCode = true;
    }

    const token = await this.jwtService.generateResetPasswordToken(userExisted);

    await this.emailService.sendEmailFromTemplate('PASSWORDRESET', { name: userExisted.name, token: token }, userExisted.email);

    return {result: bRetCode};
  }

  @get('/user/forget/mobile/{mobile}', {
    responses: {
      '200': {
        description: 'Forget password',
      },
    },
  })
  async forgetPasswordByMobile(
    @param.path.string('mobile') mobile: string,
  ): Promise<{result: Boolean; token: string}> {
    let bRetCode = false;
    const userExisted = await this.userRepository.findOne({
      where: {mobile: mobile},
    });

    if (!userExisted) {
      throw new HttpErrors.Unauthorized('No valid users');
    } else {
      bRetCode = true;
    }

    const token = await this.jwtService.generateResetPasswordToken(userExisted);

    return {result: bRetCode, token: token};
  }

  @post('/user/forget', {
    responses: {
      '200': {
        description: 'Forget password',
      },
    },
  })
  async setNewPassword(
    @requestBody({
      required: true,
      content: {
        'application/x-www-form-urlencoded': {schema: ForgetPasswordSchema},
      },
    })
    forget: ForgetPassword,
  ): Promise<{result: Boolean}> {
    const userId = await this.jwtService.decodeResetPasswordToken(forget.token);
    const credential = await this.userRepository.findCredentials(userId);

    if (!credential) {
      throw new HttpErrors.Unauthorized('Invalid forget password token');
    } else {
      credential.password = await this.passwordHasher.hashPassword(
        forget.password,
      );
      credential.resetToken = '';

      await this.credentialRepository.update(credential);
    }

    return {result: true};
  }
}
