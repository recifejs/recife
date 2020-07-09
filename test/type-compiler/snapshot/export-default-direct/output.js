'use-strict';

module.exports = {
  types: [
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
        }
      ],
      options: {},
      name: 'User',
      nameModel: 'User',
      isExportDefaultModel: true
    }
  ]
};
