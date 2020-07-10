import { Query } from '../../../../src';

class InputController {
  @Query()
  getUser(input: { name?: String }): string {
    return '';
  }
}

export default InputController;
