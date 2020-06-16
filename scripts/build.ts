'use strict';

import Build from '../src/Build';
import Log from '../src/Log';

Log.Instance.title(`Build RecifeJs`);

const build = new Build();
build.run();
