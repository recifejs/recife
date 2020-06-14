import { Type, Field } from 'recife';
import Publication from './Publication';

@Type()
class CommentModel extends Publication {
  @Field('String')
  postId: String | undefined;
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
