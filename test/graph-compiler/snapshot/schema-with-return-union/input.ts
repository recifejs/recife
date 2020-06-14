import { Query } from '../../../../src';

class InputController {
  @Query()
  getUser(): string | undefined {
    return '';
  }
}

export default InputController;
