import { Query, Mutation } from 'recife';

import { CommentCreate } from '../inputs/CommentInput';
import CommentModel from '../models/CommentModel';

export default class TestController {
  @Query()
  getComment(): CommentModel {
    const comment = new CommentModel();
    comment.text = 'teste';
    comment.postId = 'ABCDE';

    return comment;
  }

  @Mutation()
  createComment(type: CommentCreate): CommentModel {
    return new CommentModel();
  }
}
