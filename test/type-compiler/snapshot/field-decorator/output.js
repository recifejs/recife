'use-strict';

module.exports = {
  types: [
    {
      fields:
        [
          {
            name: "id",
            isRequired: true,
            type: "Int"
          },
          {
            name: "name",
            isRequired: false,
            type: "String"
          }
        ],
      path: "/test/type-compiler/snapshot/field-decorator/input.ts",
      name: "User",
      nameModel: "User",
      isExportDefaultModel: false
    }
  ]
};
