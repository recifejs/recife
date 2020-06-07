import { ForbiddenError } from 'apollo-server-koa';
import { CommentCreate } from '../inputs/CommentInput';

export default class TestValidator {
  createComment(input: CommentCreate) {
    if (!input.postId) {
      throw new ForbiddenError('Post invalid!!!');
    }
  }
}
