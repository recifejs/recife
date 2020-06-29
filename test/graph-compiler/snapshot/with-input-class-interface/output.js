'use-strict';

module.exports = {
  graphs: [
    {
      nameController: 'InputController',
      options: {},
      name: 'createUser',
      isExportDefaultController: true,
      isReturnRequired: true,
      params: { name: 'input', isRequired: true, type: 'CreateUser' },
      returnType: 'String',
      type: 'Mutation'
    },
    {
      nameController: 'InputController',
      options: {},
      name: 'deleteUser',
      isExportDefaultController: true,
      isReturnRequired: true,
      params: { name: 'input', isRequired: true, type: 'DeleteUser' },
      returnType: 'String',
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
