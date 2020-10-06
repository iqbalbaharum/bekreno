import {UserProfile} from '@loopback/security';

export interface MyUserProfile extends UserProfile {
  session: string;
  roles: Array<string>;
  mobile: string;
  user: string;
}
