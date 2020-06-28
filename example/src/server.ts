import { IServer } from 'recife';

class Server implements IServer {
  beforeStarted() {
    //
  }

  started() {
    //
  }

  beforeMounted() {
    //
  }

  mounted() {
    //
  }

  beforeUpdated() {
    //
  }

  updated() {
    //
  }

  catch(e: any) {
    console.log(e);
  }
}

export default Server;
