import { Type, Field } from 'recife';

@Type({ onlyHeritage: true })
export class User {
  id?: Number;
  name?: string;
  @Field({ visible: false })
  cash: Number;
}
@Type()
class InputModel extends User {
  age: Number;
}

export default InputModel;
