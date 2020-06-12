'use strict';

module.exports = {
  include: ['src', 'scripts'],
  exclude: ['coverage', 'test', 'example'],
  reporter: ['html', 'lcov', 'text-lcov'],
  'report-dir': 'coverage'
};
