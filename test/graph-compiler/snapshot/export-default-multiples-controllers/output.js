'use-strict';

module.exports = {
  graphs: [
    {
      nameController: 'InputController',
      options: {},
      name: 'getUser',
      isExportDefaultController: true,
      isReturnRequired: true,
      returnType: 'String',
      type: 'Query'
    },
    {
      nameController: 'AnotherInputController',
      options: {},
      name: 'createUser',
      isExportDefaultController: false,
      isReturnRequired: true,
      returnType: 'String',
      type: 'Mutation'
    }
  ]
};
