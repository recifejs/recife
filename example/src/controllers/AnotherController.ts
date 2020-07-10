import { Query, Mutation } from 'recife';

import { CommentUpdate } from '../inputs/CommentInput';
import CommentModel from '../models/CommentModel';

interface CommentDelete {
  postId: string;
  commentId?: String;
}

class AnotherController {
  @Mutation()
  deleteComment(input: CommentDelete | undefined): boolean | undefined | null {
    return false;
  }

  @Mutation()
  updateComment(input: { text: String }): Array<CommentModel> {
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
