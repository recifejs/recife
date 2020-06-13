import { Query } from '../../../../src';

export class InputController {
  private value = '';

  @Query()
  getUser(): string {
    return value;
  }
}
