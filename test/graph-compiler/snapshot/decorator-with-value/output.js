'use-strict';

module.exports = {
  graphs: [
    {
      nameController: 'InputController',
      options: { name: 'readUser' },
      return: { type: 'String', isArray: false, isRequired: true },
      name: 'getUser',
      isExportDefaultController: true,
      type: 'Query'
    }
  ]
};
