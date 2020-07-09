'use-strict';

module.exports = {
  types: [
    {
      fields: [
        {
          visible: true,
          parentName: 'User',
          name: 'id',
          isRequired: true,
          isArray: false,
          type: 'Int'
        },
        {
          visible: true,
          parentName: 'User',
          name: 'name',
          isRequired: false,
          isArray: false,
          type: 'String'
        }
      ],
      options: {},
      name: 'User',
      nameModel: 'User',
      isExportDefaultModel: false
    }
  ]
};
