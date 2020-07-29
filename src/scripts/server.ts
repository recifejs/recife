'use strict';

import Server from '../Server';
import Log from '../log';

Log.Instance.title(`Start Server RecifeJs`);

const server = new Server();
server.run();
