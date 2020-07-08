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
      fields: [{ visible: true, parentName: 'CreateUser', name: 'name', isRequired: false, type: 'String' }],
      name: 'CreateUser'
    },
    {
      fields: [{ visible: true, parentName: 'DeleteUser', name: 'name', isRequired: false, type: 'String' }],
      name: 'DeleteUser'
    }
  ]
};
