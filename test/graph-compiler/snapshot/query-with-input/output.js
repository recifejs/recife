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
      name: 'FilterUser',
      exportDefault: false,
      fields: [{ visible: true, name: 'name', isRequired: false, type: 'String', parentName: 'FilterUser' }]
    }
  ]
};
