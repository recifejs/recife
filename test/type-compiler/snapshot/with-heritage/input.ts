import { Type } from 'recife';

@Type()
export class User {
  name?: String;
}

@Type()
export class Author extends User {
  emails: String[];
}
