import { User } from './user';

export interface Librarian {
  id?: number;
  user?: User;
}

export interface Member {
  id?: number;
  user?: User;
  membershipCoverage?: string;
  librarian?: Librarian;
}