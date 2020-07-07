export type CommentCreate = {
  postId: string | undefined;
  text: string;
};

export interface CommentDelete {
  postId: string;
  commentId?: String;
}

export class CommentUpdate {
  postId!: String;
  text!: String;
  commentId?: String;
  params?: {
    a: string;
    b: string;
  };
}

type CommentFilter = {
  postId: string;
  commentId?: String;
};

export default CommentFilter;
