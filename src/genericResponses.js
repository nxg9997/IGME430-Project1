const sendResponse = (req, res, code) => {
  res.writeHead(code);
  res.end();
};

module.exports.sendResponse = sendResponse;
