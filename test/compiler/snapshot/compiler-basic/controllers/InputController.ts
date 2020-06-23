import { Query } from '../../../../../src';
import { FilterUser, CreateUserInput } from './UserInput';
import InputModel from '../models/InputModel';

class InputController {
  @Query()
  getUser(input: FilterUser): InputModel | undefined {
    return new InputModel();
  }

  @Query()
  allUsers(input?: FilterUser): InputModel[] {
    return [new InputModel()];
  }

  @Mutation()
  createUser(input: CreateUserInput): InputModel {
    return new InputModel();
  }
}

export default InputController;
