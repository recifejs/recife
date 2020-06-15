'use-strict';

module.exports = {
  types: [
    {
      fields: [
        {
          name: 'name',
          isRequired: false,
          type: 'String'
        },
        {
          name: 'exist',
          isRequired: false,
          type: 'Boolean'
        }
      ],
      options: {},
      name: 'User',
      nameModel: 'User',
      isExportDefaultModel: true
    }
  ]
};
