import { Type } from '../../../src';

@Type()
class CommentModel {
  postId!: String;
  text!: String;
}

export default CommentModel;
