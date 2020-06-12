import { Type, Field } from 'recife';

@Type()
class CommentModel {
  @Field("String")
  postId!: String;
  text!: String;
  date?: Date;
  author?: AuthorModel;

  static getAuthor(comment: CommentModel) {
    const author = new AuthorModel();
    author.name = 'André Lins';

    return author;
  }
}

@Type()
export class AuthorModel {
  name!: String;
}

export default CommentModel;
