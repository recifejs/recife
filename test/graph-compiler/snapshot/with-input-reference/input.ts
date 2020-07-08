import { Query } from '../../../../src';

type FilterUser = {
  name?: String;
};

class InputController {
  @Query()
  getUser(input: FilterUser): string {
    return '';
  }
}

export default InputController;
