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
          isArray: false,
          type: 'String'
        },
        {
          visible: true,
          parentName: 'UserParams',
          name: 'b',
          isRequired: true,
          isArray: false,
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
          isArray: false,
          type: 'String'
        },
        {
          visible: true,
          parentName: 'User',
          name: 'exist',
          isRequired: false,
          isArray: false,
          type: 'Boolean'
        },
        {
          visible: true,
          parentName: 'User',
          name: 'emails',
          isRequired: true,
          isArray: true,
          type: 'String'
        },
        {
          visible: true,
          parentName: 'User',
          name: 'params',
          isRequired: false,
          isArray: false,
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
