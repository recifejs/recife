import { Type } from 'recife';
@Type({ onlyHeritage: true })
export class Person {
  id: String;
}

@Type()
export class User extends Person {
  name?: String;
}

@Type()
export class Author extends User {
  emails: String[];
}
