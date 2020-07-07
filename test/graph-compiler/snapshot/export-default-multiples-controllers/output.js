'use-strict';

module.exports = {
  graphs: [
    {
      nameController: 'InputController',
      options: {},
      return: { type: 'String', isArray: false, isRequired: true },
      name: 'getUser',
      isExportDefaultController: true,
      type: 'Query'
    },
    {
      nameController: 'AnotherInputController',
      options: {},
      return: { type: 'String', isArray: false, isRequired: true },
      name: 'createUser',
      isExportDefaultController: false,
      type: 'Mutation'
    }
  ]
};
