'use-strict';

module.exports = {
  types: [
    {
      fields: [
        {
          visible: true,
          parentName: 'UserParams',
          name: 'a',
          isRequired: true,
          type: 'String'
        },
        {
          visible: true,
          parentName: 'UserParams',
          name: 'b',
          isRequired: true,
          type: 'String'
        }
      ],
      options: {},
      name: 'UserParams',
      nameModel: 'UserParams',
      isExportDefaultModel: false
    },
    {
      fields: [
        {
          visible: true,
          parentName: 'User',
          name: 'name',
          isRequired: false,
          type: 'String'
        },
        {
          visible: true,
          parentName: 'User',
          name: 'exist',
          isRequired: false,
          type: 'Boolean'
        },
        {
          visible: true,
          parentName: 'User',
          name: 'emails',
          isRequired: true,
          type: '[String]'
        },
        {
          visible: true,
          parentName: 'User',
          name: 'params',
          isRequired: false,
          type: 'UserParams'
        }
      ],
      options: {},
      name: 'User',
      nameModel: 'User',
      isExportDefaultModel: true
    }
  ]
};
