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
      fields: [{ visible: true, parentName: 'FilterUser', name: 'name', isRequired: false, type: 'String' }],
      exportDefault: false,
      name: 'FilterUser'
    }
  ]
};
