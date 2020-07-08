import { Type } from 'recife';

@Type()
class User {
  name?: String;
  exist?: Boolean;
  emails: String[];
  params?: {
    a: string;
    b: string;
  };
}

export default User;
