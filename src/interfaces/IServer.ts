interface IServer {
  beforeStarted(): void;
  started(): void;
  beforeMounted(): void;
  mounted(): void;
  beforeUpdated(): void;
  beforeUpdated(): void;
  updated(): void;
  catch(error: any): void;
}

export default IServer;
