import { Type } from 'recife';

@Type()
class User {
  name: String | undefined;
  exist?: Boolean;
}

export default User;
