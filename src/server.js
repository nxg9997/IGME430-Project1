const http = require('http');
/*const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const jsHandler = require('./jsResponses.js');
const cssHandler = require('./cssResponses.js');
const genericHandler = require('./genericResponses.js');*/

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (req, res) => {
  // console.log(req.method);
  const rawUrl = req.url.split('?')[0];
  if (req.method === 'GET') {
    switch (rawUrl) {
      default:
        //jsonHandler.getNotFound(req, res);
        break;
    }
  } else if (req.method === 'HEAD') {
    switch (rawUrl) {
      default:
        //genericHandler.sendResponse(req, res, 404);
        break;
    }
  } else if (req.method === 'POST') {
    switch (rawUrl) {
      default:
        //genericHandler.sendResponse(req, res, 403);
        break;
    }
  }
};

http.createServer(onRequest).listen(port);
// console.log(`Listening on localhost:${port}`);
