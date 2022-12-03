import { Author, Person } from './author.model';
import { Librarian } from './librarian';
import { Publisher } from './publisher';
import { User } from './user';

export class Document {
  id?: number;
  hierarchicalClassification?: string;
  createdBy?: Librarian;
  createdDate?: string;
  updatedBy?: Librarian;
  updatedDate?: string;
  deletedBy?: Librarian;
  deletedDate?: string;
  documentType?: TypeOfDocument;
  book?: Book;
};

export type TypeOfDocument = 'BOOK' | 'MAGAZINE' | 'JOURNAL_ARTICLE' | 'THESIS' |'REPORT';

class BaseDoc {
  authors?: Person[];
  authorsList?: Author[];
}

export class Book extends BaseDoc {
  id?: number;
  document?: Document;
  title?: string;
  edition?: number;
  year?: number;
  isbn?: string;
  category?: string;
  publishedBy?: Publisher;
}

export class Magazine extends BaseDoc {
  id?: number;
  document?: Document;
  title?: string;
  edition?: number;
  year?: number;
  isbn?: string;
  category?: string;
  publishedBy?: Publisher;
}

export class Thesis extends BaseDoc {
  id?: number;
  document?: Document;
  topic?: string;
  publishedBy?: Publisher;
}