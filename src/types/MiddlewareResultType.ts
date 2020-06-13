type MiddlewareResultType = {
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

export default MiddlewareResultType;
