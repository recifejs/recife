'use-strict';

module.exports = {
  graphs: [
    {
      nameController: 'InputController',
      path: '/test/graph-compiler/snapshot/export-default-multiples-controllers/input.ts',
      isExportDefaultController: true,
      name: 'getUser',
      returnType: 'String',
      type: 'Query'
    },
    {
      nameController: 'AnotherInputController',
      path: '/test/graph-compiler/snapshot/export-default-multiples-controllers/input.ts',
      isExportDefaultController: false,
      name: 'createUser',
      returnType: 'String',
      type: 'Mutation'
    }
  ]
};
