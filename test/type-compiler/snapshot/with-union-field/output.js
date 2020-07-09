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
        }
      ],
      options: {},
      name: 'User',
      nameModel: 'User',
      isExportDefaultModel: true
    }
  ]
};
