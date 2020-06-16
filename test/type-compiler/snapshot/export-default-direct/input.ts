import { Type } from 'recife';

@Type()
export default class User {
  name?: String;
  exist?: Boolean;
  emails: String[];
}
