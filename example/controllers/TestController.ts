import { Query, Mutation } from "../../src";

import { CommentCreate } from "../inputs/CommentInput";

export default class TestController {
  @Query()
  getComment() {
    return "teste";
  }

  @Query()
  getPost() {
    return "post";
  }

  @Mutation()
  createComment(type: CommentCreate) {
    return "create";
  }
}
