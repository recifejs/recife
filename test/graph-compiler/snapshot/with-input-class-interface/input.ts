import { Mutation } from '../../../../src';
import { CreateUser, DeleteUser } from './UserInput';

class InputController {
  @Mutation()
  createUser(input: CreateUser): string {
    return '';
  }

  @Mutation()
  deleteUser(input: DeleteUser): string {
    return '';
  }
}

export default InputController;
