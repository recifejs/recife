'use-strict';

module.exports = {
  types: [
    {
      fields: [
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
    },
    {
      fields: [
        {
          name: 'emails',
          isRequired: true,
          type: '[String]'
        }
      ],
      options: {},
      name: 'Author',
      nameModel: 'Author',
      isExportDefaultModel: false,
      heritageName: 'User'
    }
  ]
};
