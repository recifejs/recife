import { Mutation } from "../../src";

import { CommentDelete, CommentUpdate } from "../inputs/CommentInput";

class AnotherController {
  @Mutation()
  deleteComment(input: CommentDelete) {
    return "teste";
  }

  @Mutation()
  updateComment(input: CommentUpdate) {
    return "post";
  }
}

export default AnotherController;
