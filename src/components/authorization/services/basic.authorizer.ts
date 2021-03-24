import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer,
} from '@loopback/authorization';
import {Provider} from '@loopback/core';
import {securityId, UserProfile} from '@loopback/security';

interface ExtendedAuthorizationMetadata extends AuthorizationMetadata {
  action?: string;
}
// Class level authorizer
export class BasicAuthorizationProvider implements Provider<Authorizer> {
  currentUser: UserProfile;
  args: Array<object>;
  constructor() {}

  /**
   * @returns authenticateFn
   */
  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: ExtendedAuthorizationMetadata,
  ): Promise<AuthorizationDecision> {
    let isAuthorized = false;

    const {allowedRoles = []} = metadata; // empty array means everything will be rejected

    if (authorizationCtx.principals.length > 0) {
      const user = authorizationCtx.principals[0];
      this.currentUser = {
        [securityId]: user.id,
        userid: user.user,
        roles: user.roles,
      };
      this.args = authorizationCtx.invocationContext.args;
    } else {
      return AuthorizationDecision.DENY;
    }

    if (!this.currentUser.roles) {
      return AuthorizationDecision.DENY;
    }

    if (this.currentUser.roles.includes('master')) {
      return AuthorizationDecision.ALLOW;
    }

    for (const role of allowedRoles) {
      if (this.currentUser.roles.includes(role)) {
        isAuthorized = true;
        break;
      }
    }

    return isAuthorized
      ? AuthorizationDecision.ALLOW
      : AuthorizationDecision.DENY;
  }
}
