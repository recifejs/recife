'use-strict';

module.exports = {
  graphs: [
    {
      nameController: 'InputController',
      path: '/test/graph-compiler/snapshot/query-with-input/input.ts',
      options: {},
      params: { name: 'input', type: 'FilterUser', isRequired: true },
      isExportDefaultController: true,
      name: 'getUser',
      returnType: 'String',
      type: 'Query'
    }
  ],
  inputs: [
    {
      name: 'FilterUser',
      fields: [{ name: 'name', type: 'String', isRequired: false }]
    }
  ]
};
