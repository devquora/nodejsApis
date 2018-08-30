'use strict';
const DB = require('../config/database');

exports.index = function(req, res) {
    return res.status(200).send({
      status: true,
      message: "Welcome to Node Express and Mysql App",
      statusCode: 200,
      data: null
    });
};

exports.listUsers = function(req, res) {
  let sql="select name from wf_users where active=1 limit 0,10";
  DB.query(sql, function (err, result) {
    if (err) throw err;
    
   return res.status(200).send({
      status: true,
      message: "Welcome to Node Express and Mysql App",
      statusCode: 200,
      data: result
    });
  });

   
};