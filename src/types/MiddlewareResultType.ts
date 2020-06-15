export type MiddlewareGlobalType = {
  request: {
    method: string;
    url: string;
    header: any;
  };
  response: {
    status: Number;
    message: string;
    header: any;
  };
};

export type MiddlewareType = {
  parent?: any;
  args?: any;
  context?: any;
  info?: any;
};
