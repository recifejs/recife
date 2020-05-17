import Query from "./decorators/Query";

export default class TestController {
  @Query()
  getComment() {
    return "teste";
  }

  @Query()
  getPost() {
    return "post";
  }
}
