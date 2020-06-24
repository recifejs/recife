import { Type, Field } from 'recife';
import Publication from './Publication';

@Type()
class CommentModel extends Publication {
  @Field('String')
  postId: String | undefined;
  @Field({ visible: false })
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
  @Field({ visible: false })
  book?: BookModel;
}
export class BookModel {
  name!: String;
}

export default CommentModel;
