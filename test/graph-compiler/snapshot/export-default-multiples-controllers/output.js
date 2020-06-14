'use-strict';

module.exports = {
  graphs: [
    {
      nameController: 'InputController',
      path: '/test/graph-compiler/snapshot/export-default-multiples-controllers/input.ts',
      options: {},
      isExportDefaultController: true,
      name: 'getUser',
      returnType: 'String',
      type: 'Query'
    },
    {
      nameController: 'AnotherInputController',
      path: '/test/graph-compiler/snapshot/export-default-multiples-controllers/input.ts',
      options: {},
      isExportDefaultController: false,
      name: 'createUser',
      returnType: 'String',
      type: 'Mutation'
    }
  ]
};
