const mysql = require('mysql');
const dbData = require('./config.js');
const genericHandler = require('./genericResponses.js');
const jsonHandler = require('./jsonResponses.js');
const dataHandler = require('./dataHandler.js');

const addUser = (req, res) => {
    let conn = mysql.createConnection(process.env.JAWSDB_URL || dbData.getData.mysql_str);

    let data = [];
    req.on('data', (chunk)=>{
        data.push(chunk);
    });
    req.on('end', ()=>{
        data = JSON.parse(data);
        query();
    });

    function query(){
        conn.connect();

        conn.query(`select scripts from data where user='${data.user}'`,[],(err2,res3,fields2)=>{
            console.log(res3);
            if(err2){
                console.log(err2);
                genericHandler.sendResponse(req,res,500);
                return;
            }
            else if(res3.length === 0){
                conn.query(`insert into data (user,password,scripts) values ("${data.user}","${data.password}",'{"scripts":[]}')`,
                    [],
                    (err,res2,fields)=>{
                        if(err){
                            console.log(err);
                            //logger.error(err);
                            //res.send({result:"fail"});
                            genericHandler.sendResponse(req,res,500);
                            return;
                        }
                        else{
                            console.log(res2);
                            /*result = res2;
                            res.send(result);*/
                            genericHandler.sendResponse(req,res,201);
                        }
                    }
                );
            
                conn.end();
            }
            else{
                genericHandler.sendResponse(req,res,401);
                return;
            }
        });

        
    }
    
};

const authenticate = (req,res,data,callback=null) => {
    const conn = mysql.createConnection(process.env.JAWSDB_URL || dbData.getData.mysql_str);

    conn.query(`select * from data where user='${data.user}' and password='${data.password}'`,[],(err,res2,fields)=>{
        if(err){
            //genericHandler.sendResponse(req,res,500);
            //return;
            data.auth = 'false';
        }
        else if(res2.length === 0){
            data.auth = 'true';
        }
        if(callback !== null){
            callback(data);
        }
    });

    conn.end();
};

const getScripts = (req,res) => {
    let data = [];
    req.on('data', (chunk)=>{
        data.push(chunk);
    });
    req.on('end', ()=>{
        data = JSON.parse(data);
        doGetScripts();
    });

    function doGetScripts(){
        authenticate(req,res,data,(result)=>{
            if(result.auth === 'false'){
                genericHandler.sendResponse(req,res,401);
                return;
            }
            const conn = mysql.createConnection(process.env.JAWSDB_URL || dbData.getData.mysql_str);

            conn.query(`select scripts from data where user='${data.user}' and password='${data.password}'`,[],(err,res2,fields)=>{
                if(err){
                    genericHandler.sendResponse(req,res,500);
                    return;
                }
                else{
                    jsonHandler.sendResponse(req,res,200,{'Content-Type':'application/json'},JSON.parse(res2[0].scripts));
                    return;
                }
            })
        })
    }
};

const addScript = (req, res) => {
    dataHandler.getChunks(req,res,(data)=>{
        authenticate(req,res,data,(result)=>{
            if(result.auth === 'false'){
                genericHandler.sendResponse(req,res,401);
                return;
            }
            else{
                const conn = mysql.createConnection(process.env.JAWSDB_URL || dbData.getData.mysql_str);
                console.log(result);
                conn.query(`update data set scripts='{"scripts":${JSON.stringify(result.scripts)}}' where user='${result.user}' and password='${result.password}'`,[],(err,res2,fields)=>{
                    if(err){
                        genericHandler.sendResponse(req,res,500);
                        console.log(err);
                        return;
                    }
                    else{
                        jsonHandler.sendResponse(req,res,204,{'Content-Type':'application/json'},{'message':'updated scripts'});
                        return;
                    }
                })
            }
        })
    });
};

module.exports.addUser = addUser;
module.exports.getScripts = getScripts;
module.exports.addScript = addScript;