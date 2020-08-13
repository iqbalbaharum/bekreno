import {TokenService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';
// The User model is imported from the application,
// which makes the component not entirely independent
import {User} from '../../models/user.model';
import {Credentials} from './../../types/credential.types';
import {PasswordHasher} from './services/hash.password.bcryptjs';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE: string = process.env.TOKEN_SECRET ?? 'baljs';
  export const TOKEN_EXPIRES_IN_VALUE: string =
    process.env.TOKEN_EXPIRY ?? '21600';
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>(
    'services.user.service',
  );
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}
