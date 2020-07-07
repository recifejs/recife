import { Query } from '../../../../src';

class InputController {
  @Query()
  getUser(): Array<string> {
    return ['', ''];
  }
}

export default InputController;
