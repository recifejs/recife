import { Query, Mutation } from 'recife';

import { CommentCreate } from '../inputs/CommentInput';
import CommentModel from '../models/CommentModel';

export default class TestController {
  @Query()
  getComment(_: any, { context }: any): CommentModel {
    const comment = new CommentModel();
    comment.text = 'teste';
    comment.postId = 'ABCDE';

    return comment;
  }

  @Mutation()
  createComment(input: CommentCreate): CommentModel {
    return new CommentModel();
  }
}
