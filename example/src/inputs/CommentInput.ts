export type CommentCreate = {
  postId: String;
  text: String;
};

export type CommentDelete = {
  postId: string;
  commentId: String;
};

export type CommentUpdate = {
  postId: String;
  text: String;
  commentId: String;
};
