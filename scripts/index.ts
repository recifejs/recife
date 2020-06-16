'use strict';

process.on('unhandledRejection', err => {
  throw err;
});

import { spawnSync } from 'child_process';
import Log from '../src/Log';

const args = process.argv.slice(2);
const scripts = ['start', 'build', 'server'];

if (args.length === 0) {
  Log.Instance.error('\x1b[31mEmpty script.');
  process.exit(1);
}

const script = args[0];

if (scripts.includes(script)) {
  const result = spawnSync('node', [`${__dirname}/${script}.js`, ...process.argv.slice(3)], { stdio: 'inherit' });
  process.exit(result.status!);
} else {
  Log.Instance.error(`\x1b[31mUnknown script ${script}.\x1b[0m`);
  Log.Instance.error('See: http://github.com/recifejs/recife');
  process.exit(1);
}
