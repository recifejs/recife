import { Query, Mutation } from 'recife';

import CommentModel from '../models/CommentModel';
import { CommentUpdate } from '../inputs/CommentInput';

interface CommentDelete {
  postId: string;
  commentId?: String;
}

class AnotherController {
  @Mutation()
  deleteComment(input: CommentDelete | undefined): boolean | undefined {
    return false;
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
