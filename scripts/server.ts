'use strict';

import Server from '../src/Server';
import Log from '../src/Log';

Log.Instance.title(`Start Server RecifeJs`);

const server = new Server();
server.run();
