import { Type } from 'recife';

@Type()
class CommentModel {
  postId!: String;
  text!: String;
  date?: Date;
}

export default CommentModel;
