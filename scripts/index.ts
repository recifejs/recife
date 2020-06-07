'use strict';

process.on('unhandledRejection', err => {
  throw err;
});

import { spawnSync } from 'child_process';

const args = process.argv.slice(2);
const scripts = ['start', 'build'];

if (args.length === 0) {
  console.log('\x1b[31mEmpty script.');
  process.exit(1);
}

const script = args[0];

console.log(`\x1b[36m\nRecifeJs (${script})`, '\x1b[0m');

if (scripts.includes(script)) {
  const result = spawnSync('node', [`${__dirname}/${script}.js`, ...process.argv.slice(3)], { stdio: 'inherit' });
  process.exit(result.status!);
} else {
  console.log(`\x1b[31mUnknown script ${script}.\x1b[0m`);
  console.log('See: http://github.com/recifejs/recife');
  process.exit(1);
}
