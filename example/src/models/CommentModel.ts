import { Type, Field } from 'recife';
import Publication from './Publication';

@Type({ name: 'Post' })
class CommentModel extends Publication {
  @Field('String')
  postId: String | undefined;
  @Field({ visible: false })
  date?: Date;
  author?: AuthorModel;
}

@Type({ name: 'User' })
export class AuthorModel {
  name!: String;
  book?: BookModel;
  params?: {
    a: string;
    b: string;
  };
}

@Type({ name: 'Journal' })
export class BookModel {
  name!: String;
}

export default CommentModel;
