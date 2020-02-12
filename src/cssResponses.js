const fs = require('fs');

// const clientCss = fs.readFileSync(`${__dirname}/../client/style.css`);


const getClientCss = (req, res) => {
  fs.readFile(`${__dirname}/../client/style.css`, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.write({ message: 'Couldn\'t find style.css', id: 'Internal Server Error' });
      res.end();
    } else {
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.write(data);
      res.end();
    }
  });
};

module.exports.getClientCss = getClientCss;
