const fs = require('fs');

// const clientJs = fs.readFileSync(`${__dirname}/../client/client.js`);

// send the requested JS file back to the client
const sendFile = (req, res, path) => {
  fs.readFile(path, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.write('{message: "Couldn\'t find file",id: "Internal Server Error"}');
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.write(data);
      res.end();
    }
  });
};

// send bf compiler to the client
const getBfInterpreter = (req, res) => {
  sendFile(req, res, `${__dirname}/../client/lib/bf.js`);
};

// send client JS to the client
const getClientJS = (req, res) => {
  sendFile(req, res, `${__dirname}/../client/client.js`);
};

module.exports.getBfInterpreter = getBfInterpreter;
module.exports.getClientJS = getClientJS;
