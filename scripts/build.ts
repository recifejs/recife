'use strict';

import Build from '../src/Build';
import Log from '../src/log';

Log.Instance.title(`Build RecifeJs`);

const build = new Build();
build.run();
