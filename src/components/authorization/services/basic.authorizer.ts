import {
  AuthorizationContext,
  AuthorizationDecision,
  AuthorizationMetadata,
  Authorizer
} from '@loopback/authorization';
import {Provider} from '@loopback/core';
import {securityId, UserProfile} from '@loopback/security';

interface ExtendedAuthorizationMetadata extends AuthorizationMetadata {
  action?: string;
}
// Class level authorizer
export class BasicAuthorizationProvider implements Provider<Authorizer> {
  currentUser: UserProfile
  args: Array<object>
  constructor(
  ) {}

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

    const {allowedRoles = [], resource, action} = metadata; // empty array means everything will be rejected

    if (authorizationCtx.principals.length > 0) {
      const user = authorizationCtx.principals[0];
      this.currentUser = {[securityId]: user.id, userid: user.user, roles: user.roles};
      this.args = authorizationCtx.invocationContext.args;
    } else {
      return AuthorizationDecision.DENY;
    }

    if (!this.currentUser.roles) {
      return AuthorizationDecision.DENY;
    }

    if (
      this.currentUser.roles.includes('master')
    ) {
      return AuthorizationDecision.ALLOW;
    }

    for (const role of allowedRoles) {
      if (this.currentUser.roles.includes(role)) {
        isAuthorized = true
      }
    }

    if (resource && action) {
      switch (resource) {
        case 'project':
          isAuthorized = await this.projectAuthz(action);
          break;
        default:
          break;
      }
    }

    return isAuthorized ? AuthorizationDecision.ALLOW : AuthorizationDecision.DENY;
  }

  async projectAuthz(
    action: string
  ): Promise<boolean> {
    switch (action) {
      case 'create':
        return true;
      case 'read-all':
        return true;
      case 'read-own':
        return true;
      case 'update':
        return this.projectCanUpdate();
      case 'delete':
        return this.projectCanDelete();
      default:
        throw new Error(`${action} action is not implemented for project resource`)
    }
  }

  async projectCanUpdate() {
    return true;
  }

  async projectCanDelete() {
    return true;
  }
}
