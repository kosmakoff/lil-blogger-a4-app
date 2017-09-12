import { Profile } from './profile.model';

export interface User extends Profile {
  email: string | null;
}
