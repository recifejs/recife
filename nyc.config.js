'use strict';

module.exports = {
  require: ['ts-node/register'],
  include: ['src', 'scripts'],
  all: true,
  exclude: ['coverage', 'test', 'example'],
  reporter: ['html', 'lcov', 'text-lcov'],
  'report-dir': 'coverage'
};
