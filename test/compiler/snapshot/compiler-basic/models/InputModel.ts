import { Type } from 'recife';

@Type({ onlyHeritage: true })
export class User {
  id?: Number;
  name?: string;
}
@Type()
class InputModel extends User {
  age: Number;
}

export default InputModel;
