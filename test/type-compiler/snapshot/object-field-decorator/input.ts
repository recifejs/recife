import { Type, Field } from 'recife';

@Type()
export class User {
  @Field({ type: 'Int' })
  id!: Number;
  @Field({ visible: false })
  name?: String;
}
