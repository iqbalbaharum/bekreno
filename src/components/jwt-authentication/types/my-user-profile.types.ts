import {UserProfile} from '@loopback/security';
import {Role} from '../../../models';

export interface MyUserProfile extends UserProfile {
  user: string;
  session: string;
  roles: Role[];
  mobile: string;
}
