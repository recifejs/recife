import { Query, Mutation } from 'recife';

import { CommentDelete, CommentUpdate } from '../inputs/CommentInput';
import CommentModel from '../models/CommentModel';

class AnotherController {
  @Mutation()
  deleteComment(input: CommentDelete): boolean | undefined | null {
    return true;
  }

  @Mutation()
  updateComment(input: CommentUpdate): Array<CommentModel> {
    return [new CommentModel()];
  }
}

export class TestController {
  @Query()
  allComments(): Comment[] {
    return [];
  }
}

export default AnotherController;
