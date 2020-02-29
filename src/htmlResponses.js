const fs = require('fs');

// const index = fs.readFileSync(`${__dirname}/../client/index.html`);

// send the client html to the client
const getIndex = (req, res) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.write("{message:'Couldn't find index.html, id:'Internal Server Error'}");
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(data);
      res.end();
    }
  });
};

module.exports.getIndex = getIndex;
