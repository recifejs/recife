import { Type, Field } from 'recife';

@Type()
export class User {
  @Field("Int")
  id!: Number;
  name?: String;
}
