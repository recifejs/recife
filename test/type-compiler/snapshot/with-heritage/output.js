'use-strict';

module.exports = {
  types: [
    {
      fields: [
        {
          visible: true,
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
          visible: true,
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
          visible: true,
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
