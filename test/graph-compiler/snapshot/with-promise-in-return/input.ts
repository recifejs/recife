import { Query } from '../../../../src';

class InputController {
  @Query()
  getUser(): Promise<string> {
    return new Promise(resolve => {
      resolve('');
    });
  }
}

export default InputController;
