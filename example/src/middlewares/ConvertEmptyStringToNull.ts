class ConvertEmptyStringToNull {
  async handle(koa: any, next: any): Promise<any> {
    next({ test: '' });
  }
}

export default ConvertEmptyStringToNull;
