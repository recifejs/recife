import Query from "./decorators/Query";
import Mutation from "./decorators/Mutation";

import { CommentCreate } from "./inputs/CommentInput";

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
