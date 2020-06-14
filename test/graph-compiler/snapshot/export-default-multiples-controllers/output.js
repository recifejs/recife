'use-strict';

module.exports = {
  graphs: [
    {
      nameController: 'InputController',
      path: '/test/graph-compiler/snapshot/export-default-multiples-controllers/input.ts',
      options: {},
      name: 'getUser',
      isExportDefaultController: true,
      returnType: 'String',
      type: 'Query'
    },
    {
      nameController: 'AnotherInputController',
      path: '/test/graph-compiler/snapshot/export-default-multiples-controllers/input.ts',
      options: {},
      name: 'createUser',
      isExportDefaultController: false,
      returnType: 'String',
      type: 'Mutation'
    }
  ]
};
