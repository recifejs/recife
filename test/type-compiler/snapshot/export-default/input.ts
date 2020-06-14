import { Type } from 'recife';

@Type()
class User {
  name?: String;
  exist?: Boolean;
  emails: String[];
}

export default User;
