const getChunks = (req, res, callback) => {
  let data = [];
  req.on('data', (chunk) => {
    data.push(chunk);
  });
  req.on('end', () => {
    data = JSON.parse(data);
    callback(data);
  });
};

module.exports.getChunks = getChunks;
