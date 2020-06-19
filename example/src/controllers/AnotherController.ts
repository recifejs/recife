import { Query, Mutation } from 'recife';

import { CommentDelete, CommentUpdate } from '../inputs/CommentInput';
import CommentModel from '../models/CommentModel';

class AnotherController {
  @Mutation()
  deleteComment(input: CommentDelete | undefined): boolean | undefined | null {
    return true;
  }

  @Mutation()
  updateComment(input: CommentUpdate): Array<CommentModel> {
    return [new CommentModel(), new CommentModel()];
  }
}

export class TestController {
  @Query({ middlewares: ['auth'] })
  allComments(): Comment[] {
    return [];
  }
}

export default AnotherController;
