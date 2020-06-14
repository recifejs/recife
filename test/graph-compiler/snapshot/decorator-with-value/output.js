'use-strict';

module.exports = {
  graphs: [
    {
      nameController: 'InputController',
      path: '/test/graph-compiler/snapshot/decorator-with-value/input.ts',
      options: { name: 'readUser' },
      name: 'getUser',
      isExportDefaultController: true,
      returnType: 'String',
      type: 'Query'
    }
  ]
};
