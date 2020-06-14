import { Query, Mutation } from '../../../../src';

class InputController {
  @Query({ name: 'readUser' })
  getUser(): string {
    return '';
  }
}

export default InputController;
