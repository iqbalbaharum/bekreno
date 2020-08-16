import {UserProfile} from '@loopback/security';

export interface MyUserProfile extends UserProfile {
  user: string;
  roles: string[];
  mobile: string;
}
