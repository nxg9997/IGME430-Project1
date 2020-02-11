const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const jsHandler = require('./jsResponses.js');
const cssHandler = require('./cssResponses.js');
const genericHandler = require('./genericResponses.js');
const dbHandler = require('./dbHandler.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (req, res) => {
  // console.log(req.method);
  const rawUrl = req.url.split('?')[0];
  if (req.method === 'GET') {
    switch (rawUrl) {
      case '/':
        htmlHandler.getIndex(req, res);
        break;
      case '/bf':
        jsHandler.getBfInterpreter(req, res);
        break;
      case '/helloworld':
        jsonHandler.helloworld(req, res);
        break;
      case '/style':
        cssHandler.getClientCss(req, res);
        break;
      default:
        // jsonHandler.getNotFound(req, res);
        break;
    }
  } else if (req.method === 'HEAD') {
    switch (rawUrl) {
      default:
        // genericHandler.sendResponse(req, res, 404);
        break;
    }
  } else if (req.method === 'POST') {
    switch (rawUrl) {
      case '/compile':
        jsonHandler.getCompile(req, res);
        break;
      case '/addUser':
        dbHandler.addUser(req, res);
        break;
      case '/getScripts':
        dbHandler.getScripts(req, res);
        break;
      default:
        // genericHandler.sendResponse(req, res, 403);
        break;
    }
  }
};

http.createServer(onRequest).listen(port);
// console.log(`Listening on localhost:${port}`);
