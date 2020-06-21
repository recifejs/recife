import { ForbiddenError } from 'apollo-server-core';
import { CommentCreate } from '../inputs/CommentInput';

export default class TestValidator {
  createComment(input: CommentCreate) {
    if (!input.postId) {
      throw new ForbiddenError('Post invalid!!!');
    }
  }
}
