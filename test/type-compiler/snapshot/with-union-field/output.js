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
      path: '/test/type-compiler/snapshot/with-union-field/input.ts',
      name: 'User',
      nameModel: 'User',
      isExportDefaultModel: true
    }
  ]
};
