import { Query } from '../../../../src';

export default class InputController {
  @Query()
  getUser(): string {
    return '';
  }
}
