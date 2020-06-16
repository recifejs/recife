import { Subscription } from '../../../../src';

class InputController {
  @Subscription()
  getUser(): string {
    return '';
  }
}

export default InputController;
