import { Query, Mutation } from "../../src";

import { CommentCreate } from "../inputs/CommentInput";

export default class TestController {
  @Query()
  getComment(): String {
    return "teste";
  }

  @Query()
  getPost() : string {
    return "post";
  }

  @Mutation()
  createComment(type: CommentCreate) {
    return "create";
  }
}
