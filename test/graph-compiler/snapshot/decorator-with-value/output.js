'use-strict';

module.exports = {
  graphs: [
    {
      nameController: 'InputController',
      options: { name: 'readUser' },
      name: 'getUser',
      isExportDefaultController: true,
      isReturnRequired: true,
      returnType: 'String',
      type: 'Query'
    }
  ]
};
