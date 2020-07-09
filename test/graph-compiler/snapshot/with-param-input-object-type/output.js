'use-strict';

module.exports = {
  graphs: [
    {
      nameController: 'InputController',
      options: {},
      return: { type: 'String', isArray: false, isRequired: true },
      name: 'getUser',
      isExportDefaultController: true,
      params: { name: 'input', isRequired: true, type: 'FilterUser' },
      type: 'Query'
    }
  ],
  inputs: [
    {
      fields: [
        {
          visible: true,
          parentName: 'FilterUserAddress',
          name: 'street',
          isRequired: false,
          isArray: false,
          type: 'String'
        }
      ],
      name: 'FilterUserAddress'
    },
    {
      fields: [
        { visible: true, parentName: 'FilterUser', name: 'name', isRequired: true, isArray: false, type: 'String' },
        {
          visible: true,
          parentName: 'FilterUser',
          name: 'address',
          isRequired: false,
          isArray: false,
          type: 'FilterUserAddress'
        }
      ],
      name: 'FilterUser'
    }
  ]
};
