'use-strict';

module.exports = {
  types: [
    {
      fields: [
        {
          name: 'id',
          isRequired: true,
          type: 'Int'
        },
        {
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
