'use-strict';

module.exports = {
  graphs: [
    {
      nameController: 'InputController',
      options: {},
      name: 'getUser',
      isExportDefaultController: true,
      params: { name: 'input', type: 'FilterUser', isRequired: true },
      returnType: 'String',
      type: 'Query'
    }
  ],
  inputs: [
    {
      name: 'FilterUser',
      fields: [{ name: 'name', isRequired: false, type: 'String' }]
    }
  ]
};
