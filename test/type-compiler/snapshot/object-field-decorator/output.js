'use-strict';

module.exports = {
  types: [
    {
      fields: [
        {
          visible: true,
          name: 'id',
          isRequired: true,
          type: 'Int'
        },
        {
          visible: false,
          name: 'name',
          isRequired: false,
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