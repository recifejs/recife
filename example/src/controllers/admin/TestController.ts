import { Query, Mutation } from 'recife';

import CommentAFilter, { CommentCreate as CommentCreateA, CommentDelete } from '../../inputs/CommentInput';
import CommentModel from '../../models/CommentModel';

export default class TestController {
  commentDefault: CommentModel;

  constructor() {
    this.commentDefault = new CommentModel();
    this.commentDefault.date = new Date();
  }

  @Query()
  getComment(filter: CommentAFilter, { context }: any): CommentModel {
    const comment = new CommentModel();
    comment.text = 'teste';
    comment.postId = 'ABCDE';
    comment.date = new Date();

    return comment;
  }

  @Mutation({ name: 'registerComment' })
  createComment(input: CommentCreateA): CommentModel {
    return this.commentDefault;
  }

  @Mutation()
  deleteAnotherComment(input: CommentDelete): boolean {
    return true;
  }
}
