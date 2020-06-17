'use-strict';

module.exports = {
  types: [
    {
      fields: [
        {
          name: 'id',
          isRequired: true,
          type: 'String'
        }
      ],
      options: { onlyHeritage: true },
      name: 'Person',
      nameModel: 'Person',
      isExportDefaultModel: false
    },
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
      isExportDefaultModel: false,
      heritageName: 'Person'
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
