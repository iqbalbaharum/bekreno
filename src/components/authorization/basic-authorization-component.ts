import {AuthorizationTags} from '@loopback/authorization';
import {Binding, Component} from '@loopback/core';
import {BasicAuthorizationProvider} from './services';

export class BasicAuthorizationComponent implements Component {
  bindings: Binding[] = [
    Binding.bind('authorizationProviders.basic-provider')
      .toProvider(BasicAuthorizationProvider)
      .tag(AuthorizationTags.AUTHORIZER),
  ];
}
