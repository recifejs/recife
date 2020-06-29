'use-strict';

module.exports = {
  graphs: [
    {
      nameController: 'InputController',
      options: {},
      name: 'getUser',
      isExportDefaultController: true,
      isReturnRequired: true,
      params: { name: 'input', isRequired: true, type: 'FilterUser' },
      returnType: 'String',
      type: 'Query'
    }
  ],
  inputs: [
    {
      exportDefault: true,
      name: 'FilterUser',
      fields: [{ visible: true, name: 'name', isRequired: true, type: 'String' }]
    }
  ]
};
