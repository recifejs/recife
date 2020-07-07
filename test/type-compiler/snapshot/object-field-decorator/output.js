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
          type: 'Int'
        },
        {
          visible: false,
          parentName: 'User',
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
