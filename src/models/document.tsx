import { Librarian } from './librarian';
import { Publisher } from './publisher';

export interface Document {
  id?: number;
  hierarchicalClassification?: string;
  createdBy?: Librarian;
  createdDate?: string;
  updatedBy?: Librarian;
  updatedDate?: string;
  deletedBy?: Librarian;
  deletedDate?: string;
  documentType?: TypeOfDocument;
};

export type TypeOfDocument = 'BOOK' | 'MAGAZINE' | 'JOURNAL_ARTICLE' | 'THESIS' |'REPORT';

export interface Book {
    id: number;
    bookDocument: Document;
    title: string;
    edition: number;
    year: number;
    isbn: string;
    category: string;
    publishedBy: Publisher;
}