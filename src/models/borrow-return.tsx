import { Copy } from './document.model';
import { Member } from './librarian';

export class BorrowReturn {
  borrowedBy?: Member;
  copy?: Copy;
  borrowDate?: String;
  borrowDateString?: String;
  dueDate?: String;
  returnDate?: String;
  dueDateString?: String;
  returnDateString?: String;
  isOverdue?: Boolean;
};