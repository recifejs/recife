import { Query } from '../../../../src';

class InputController {
  @Query()
  getUser(): string {
    return '';
  }
}

export default InputController;
