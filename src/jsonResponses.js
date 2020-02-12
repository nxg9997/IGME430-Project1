// const serverData = require('./data.js');
// const genericHandler = require('./genericResponses.js');
const bf = require('./bf-node.js');

const sendResponse = (req, res, code, headers, msg) => {
  res.writeHead(code, headers);
  res.write(JSON.stringify(msg));
  res.end();
};

const getNotFound = (req, res) => {
  sendResponse(req, res, 404, { 'Content-Type': 'application/json' }, { message: 'content not found', id: 'Error Not Found' });
};

const helloworld = (req, res) => {
  const result = bf.bf('++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.');
  sendResponse(req, res, 200, { 'Content-Type': 'application/json' }, { result });
};

const getCompile = (req, res) => {
  const data = [];
  req.on('data', (chunk) => {
    data.push(chunk);
  });
  req.on('end', () => {
    const final = JSON.parse(data);
    console.log(final.code);
    const result = bf.bf(final.code);
    sendResponse(req, res, 200, { 'Content-Type': 'application/json' }, { result });
  });
  // sendResponse(req,res,200,{'Content-Type':'application/json'},{'message':'did the thing :)'});
  // const result = bf.bf()
};

module.exports.helloworld = helloworld;
module.exports.getCompile = getCompile;
module.exports.sendResponse = sendResponse;
module.exports.getNotFound = getNotFound;
