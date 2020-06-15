import Recife from '../Recife';
import path = require('path');

const getMiddleware = (pathMiddleware: string): any => {
  let Middleware = undefined;

  try {
    Middleware = require(path.join(process.cwd(), 'node_modules', pathMiddleware)).default;
  } catch (e) {
    try {
      Middleware = require(path.join(Recife.PATH_BUILD, pathMiddleware)).default;
    } catch (e) {
      console.error('Middleware not exists!');
    }
  }

  return Middleware;
};

export default getMiddleware;
