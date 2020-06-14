import TypeOptions from '../types/TypeOptions';

function Type(_options: TypeOptions = {}): any {
  return function(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    if (descriptor) {
      descriptor.value = {
        type: 'Type',
        result: descriptor.value
      };
    }
  };
}

export default Type;
