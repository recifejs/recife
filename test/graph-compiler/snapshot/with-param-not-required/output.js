'use-strict';

module.exports = {
  graphs: [
    {
      nameController: 'InputController',
      options: {},
      return: { type: 'String', isArray: false, isRequired: true },
      name: 'getUser',
      isExportDefaultController: true,
      params: { name: 'input', isRequired: false, type: 'FilterUser' },
      type: 'Query'
    }
  ],
  inputs: [
    {
      fields: [{ visible: true, parentName: 'FilterUser', name: 'name', isRequired: false, type: 'String' }],
      name: 'FilterUser'
    }
  ]
};
