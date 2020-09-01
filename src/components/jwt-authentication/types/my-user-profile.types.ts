import {UserProfile} from '@loopback/security';
import {Role} from '../../../models';

export interface MyUserProfile extends UserProfile {
  user: string;
  roles: Role[];
  mobile: string;
}
