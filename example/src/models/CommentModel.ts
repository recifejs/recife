import { Type } from 'recife';

@Type()
class CommentModel {
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
