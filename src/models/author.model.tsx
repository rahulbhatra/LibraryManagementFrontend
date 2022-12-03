import { Document } from './document.model';

export class Person {
  firstName?: string;
  middleName?: string;
  lastName?: string;
}

export class Author {
  person?: Person;
  document?: Document;
}