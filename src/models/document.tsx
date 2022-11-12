import { Librarian } from './librarian';
import { Publisher } from './publisher';

export interface Document {
  id: number;
  hierarchicalClassification: string;
  createdBy: Librarian;
  createdDate: string;
  updatedBy: Librarian;
  updatedDate: string;
  deletedBy: Librarian;
  deletedDate: string;
  documentType: DocumentType;
};

export interface DocumentType {
  documentType: 'BOOK' | 'MAGAZINE' | 'JOURNAL_ARTICLE' | 'THESIS' |  'REPORT';
};

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