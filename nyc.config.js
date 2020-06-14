'use strict';

module.exports = {
  require: ['ts-node/register'],
  include: ['src', 'scripts'],
  all: true,
  exclude: ['coverage', 'test', 'example'],
  reporter: ['html', 'lcov', 'text'],
  'report-dir': 'coverage',
  'check-coverage': 'true',
  statements: 49,
  branches: 50,
  functions: 48,
  lines: 50
};
