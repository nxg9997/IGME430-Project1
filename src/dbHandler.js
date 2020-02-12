const mysql = require('mysql');
const dbData = require('./config.js');
const genericHandler = require('./genericResponses.js');
const jsonHandler = require('./jsonResponses.js');
const dataHandler = require('./dataHandler.js');

const addUser = (req, res) => {
  const conn = mysql.createConnection(process.env.JAWSDB_URL || dbData.getData.mysql_str);
  let data = [];

  function query() {
    conn.connect();

    conn.query(`select scripts from data where user='${data.user}'`, [], (err2, res3) => {
      // console.log(res3);
      if (err2) {
        // console.log(err2);
        // genericHandler.sendResponse(req,res,500);
        jsonHandler.sendResponse(req, res, 500, { 'Content-Type': 'application/json' }, { 'message': 'Server Error', 'id': 'Internal Server Error' });
        return;
      }
      if (res3.length === 0) {
        conn.query(`insert into data (user,password,scripts) values ("${data.user}","${data.password}",'{"scripts":[]}')`,
          [],
          (err) => {
            if (err) {
              // console.log(err);
              // logger.error(err);
              // res.send({result:"fail"});
              // genericHandler.sendResponse(req,res,500);
              jsonHandler.sendResponse(req, res, 500, { 'Content-Type': 'application/json' }, { 'message': 'Server Error', 'id': 'Internal Server Error' });
              return;
            }

            // console.log(res2);
            /* result = res2;
                            res.send(result); */
            // genericHandler.sendResponse(req,res,201);
            jsonHandler.sendResponse(req, res, 201, { 'Content-Type': 'application/json' }, { 'message': 'Created New User' });
          });

        conn.end();
      } else {
        // genericHandler.sendResponse(req,res,401);
        jsonHandler.sendResponse(req, res, 401, { 'Content-Type': 'application/json' }, { 'message': 'Unauthorized', 'id': 'Unauthorized' });
      }
    });
  }

  req.on('data', (chunk) => {
    data.push(chunk);
  });
  req.on('end', () => {
    data = JSON.parse(data);
    query();
  });
};

const authenticate = (req, res, data, callback = null) => {
  const conn = mysql.createConnection(process.env.JAWSDB_URL || dbData.getData.mysql_str);

  conn.query(`select * from data where user='${data.user}' and password='${data.password}'`, [], (err, res2) => {
    let result = 'false';
    // console.log(res2.length);
    if (err) {
      // genericHandler.sendResponse(req,res,500);
      // return;
      result = 'false';
    }
    if (res2.length !== 0) {
      result = 'true';
    }
    if (callback !== null) {
      callback(result);
    }
  });

  conn.end();
};

const getScripts = (req, res) => {
  let data = [];

  function doGetScripts() {
    authenticate(req, res, data, (result) => {
      if (result === 'false') {
        // genericHandler.sendResponse(req,res,401);
        jsonHandler.sendResponse(req, res, 401, { 'Content-Type': 'application/json' }, { 'message': 'Unauthorized', 'id': 'Unauthorized' });
        return;
      }
      const conn = mysql.createConnection(process.env.JAWSDB_URL || dbData.getData.mysql_str);

      conn.query(`select scripts from data where user='${data.user}' and password='${data.password}'`, [], (err, res2) => {
        if (err) {
          // genericHandler.sendResponse(req,res,500);
          jsonHandler.sendResponse(req, res, 500, { 'Content-Type': 'application/json' }, { 'message': 'Server Error', 'id': 'Internal Server Error' });
        } else {
          jsonHandler.sendResponse(req, res, 200, { 'Content-Type': 'application/json' }, JSON.parse(res2[0].scripts));
        }
      });
    });
  }

  req.on('data', (chunk) => {
    data.push(chunk);
  });
  req.on('end', () => {
    data = JSON.parse(data);
    doGetScripts();
  });
};

const addScript = (req, res) => {
  dataHandler.getChunks(req, res, (data) => {
    authenticate(req, res, data, (result) => {
      if (result === 'false') {
        // genericHandler.sendResponse(req,res,401);
        jsonHandler.sendResponse(req, res, 401, { 'Content-Type': 'application/json' }, { 'message': 'Unauthorized', 'id': 'Unauthorized' });
        return;
      }

      const conn = mysql.createConnection(process.env.JAWSDB_URL || dbData.getData.mysql_str);
      // console.log(result);
      conn.query(`update data set scripts='{"scripts":${JSON.stringify(data.scripts)}}' where user='${data.user}' and password='${data.password}'`, [], (err) => {
        if (err) {
          // genericHandler.sendResponse(req,res,500);
          jsonHandler.sendResponse(req, res, 500, { 'Content-Type': 'application/json' }, { 'message': 'Server Error', 'id': 'Internal Server Error' });
          // console.log(err);
        } else {
          genericHandler.sendResponse(req, res, 204);
        }
      });
    });
  });
};

const getAuth = (req, res) => {
  dataHandler.getChunks(req, res, (data) => {
    authenticate(req, res, data, (result) => {
      // console.log(result);
      if (result === 'true') {
        jsonHandler.sendResponse(req, res, 200, { 'Content-Type': 'application/json' }, { 'message': 'Logged In', 'auth': true });
        return;
      }

      jsonHandler.sendResponse(req, res, 401, { 'Content-Type': 'application/json' }, { 'message': 'Bad Login', 'auth': false, 'id': 'Unauthorized' });
    });
  });
};

module.exports.addUser = addUser;
module.exports.getScripts = getScripts;
module.exports.addScript = addScript;
module.exports.getAuth = getAuth;
