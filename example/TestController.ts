import Query from "./decorators/Query";
import Mutation from "./decorators/Mutation";

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
  createMutation() {
    return "create";
  }
}
