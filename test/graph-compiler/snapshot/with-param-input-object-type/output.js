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
      fields: [{ visible: true, parentName: 'FilterUserAddress', name: 'street', isRequired: false, type: 'String' }],
      name: 'FilterUserAddress',
      exportDefault: false
    },
    {
      fields: [
        { visible: true, parentName: 'FilterUser', name: 'name', isRequired: true, type: 'String' },
        { visible: true, parentName: 'FilterUser', name: 'address', isRequired: false, type: 'FilterUserAddress' }
      ],
      exportDefault: true,
      name: 'FilterUser'
    }
  ]
};
