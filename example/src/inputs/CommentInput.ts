export type CommentCreate = {
  postId?: String;
  text: String;
};

export interface CommentDelete {
  postId: string;
  commentId?: String;
}

export class CommentUpdate {
  postId!: String;
  text!: String;
  commentId?: String;
}
