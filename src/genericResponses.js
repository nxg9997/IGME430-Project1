
// - sends a response with no body
const sendResponse = (req, res, code) => {
  res.writeHead(code);
  res.end();
};

module.exports.sendResponse = sendResponse;
