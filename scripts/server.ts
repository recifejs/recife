'use strict';

import Server from '../src/Server';
import Log from '../src/log';

Log.Instance.title(`Start Server RecifeJs`);

const server = new Server();
server.run();
