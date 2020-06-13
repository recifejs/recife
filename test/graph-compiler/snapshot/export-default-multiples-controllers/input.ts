import { Query, Mutation } from '../../../../src';

class InputController {
  @Query()
  getUser(): string {
    return '';
  }
}

export class AnotherInputController {
  @Mutation()
  createUser(): string {
    return '';
  }
}

export default InputController;
