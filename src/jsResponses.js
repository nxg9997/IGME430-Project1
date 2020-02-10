const fs = require('fs');

// const clientJs = fs.readFileSync(`${__dirname}/../client/client.js`);


const getBfInterpreter = (req, res) => {
  console.log('requested bf.js');
  fs.readFile(`${__dirname}/../client/lib/bf.js`, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.write('{message: "Couldn\'t find bf.js",id: "Internal Server Error"}');
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.write(data);
      res.end();
    }
  });
};

module.exports.getBfInterpreter = getBfInterpreter;
