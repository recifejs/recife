'use-strict';

module.exports = {
  graphs: [
    {
      nameController: 'InputController',
      options: {},
      return: { type: 'String', isArray: false, isRequired: true },
      name: 'createUser',
      isExportDefaultController: true,
      params: { name: 'input', isRequired: true, type: 'CreateUser' },
      type: 'Mutation'
    },
    {
      nameController: 'InputController',
      options: {},
      return: { type: 'String', isArray: false, isRequired: true },
      name: 'deleteUser',
      isExportDefaultController: true,
      params: { name: 'input', isRequired: true, type: 'DeleteUser' },
      type: 'Mutation'
    }
  ],
  inputs: [
    {
      exportDefault: false,
      name: 'CreateUser',
      fields: [{ visible: true, name: 'name', isRequired: false, type: 'String' }]
    },
    {
      exportDefault: false,
      name: 'DeleteUser',
      fields: [{ visible: true, name: 'name', isRequired: false, type: 'String' }]
    }
  ]
};
