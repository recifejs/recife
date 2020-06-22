'use-strict';

module.exports = {
  types: [
    {
      fields: [
        {
          visible: true,
          name: 'name',
          isRequired: false,
          type: 'String'
        },
        {
          visible: true,
          name: 'exist',
          isRequired: false,
          type: 'Boolean'
        },
        {
          visible: true,
          name: 'emails',
          isRequired: true,
          type: '[String]'
        }
      ],
      options: {},
      name: 'User',
      nameModel: 'User',
      isExportDefaultModel: true
    }
  ]
};