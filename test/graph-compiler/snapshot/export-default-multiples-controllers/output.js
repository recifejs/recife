'use-strict';

module.exports = {
  graphs: [
    {
      nameController: 'InputController',
      options: {},
      name: 'getUser',
      isExportDefaultController: true,
      returnType: 'String',
      type: 'Query'
    },
    {
      nameController: 'AnotherInputController',
      options: {},
      name: 'createUser',
      isExportDefaultController: false,
      returnType: 'String',
      type: 'Mutation'
    }
  ]
};
