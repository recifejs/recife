import { Mutation } from 'recife';

import { CommentDelete, CommentUpdate } from '../inputs/CommentInput';
import CommentModel from '../models/CommentModel';

class AnotherController {
  @Mutation()
  deleteComment(input: CommentDelete): boolean | undefined | null {
    return true;
  }

  @Mutation()
  updateComment(input: CommentUpdate): CommentModel[] {
    return [new CommentModel()];
  }
}

export default AnotherController;
