'use-strict';

module.exports = {
  graphs: [
    {
      nameController: 'InputController',
      options: {},
      name: 'getUser',
      isExportDefaultController: true,
      isReturnRequired: true,
      params: { name: 'input', isRequired: false, type: 'FilterUser' },
      returnType: 'String',
      type: 'Query'
    }
  ],
  inputs: [
    {
      exportDefault: false,
      name: 'FilterUser',
      fields: [{ visible: true, name: 'name', isRequired: false, type: 'String' }]
    }
  ]
};
