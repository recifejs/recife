import { Query } from '../../../../src';

class InputController {
  @Query()
  getUser(): boolean | undefined {
    return false;
  }
}

export default InputController;
