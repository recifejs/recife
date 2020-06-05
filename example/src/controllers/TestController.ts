import { Query, Mutation } from '../../../src';

import { CommentCreate } from '../inputs/CommentInput';
import CommentModel from '../models/CommentModel';

export default class TestController {
  @Query()
  getComment(): CommentModel {
    return new CommentModel();
  }

  @Mutation()
  createComment(type: CommentCreate): CommentModel {
    return new CommentModel();
  }
}
