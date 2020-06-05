import { Type } from 'recife';

@Type()
class CommentModel {
  postId!: String;
  text!: String;
}

export default CommentModel;
