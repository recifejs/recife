import SchemaOptions from '../types/SchemaOptions';
import execMiddlewares from './execMiddlewares';

function Subscription(options: SchemaOptions = {}): any {
  return function(_target: any, _propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(args: any, optionsSchema: any) {
      const results = await execMiddlewares(options.middlewares, { ...optionsSchema, args });

      return originalMethod.apply(this, [results.args, results]);
    };

    return descriptor;
  };
}

export default Subscription;
