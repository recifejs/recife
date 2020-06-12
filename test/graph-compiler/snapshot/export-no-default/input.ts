import { Query } from '../../../../src';

export class InputController {
  @Query()
  getUser(): string {
    return '';
  }
}
