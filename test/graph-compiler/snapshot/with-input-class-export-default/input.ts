import { Query } from '../../../../src';
import FilterUser from './UserInput';

class InputController {
  @Query()
  getUser(input: FilterUser): string {
    return '';
  }
}

export default InputController;
