'use strict';
const mysql      = require('mysql');
const connection = mysql.createConnection({
						host     : process.env.DB_HOST,
						user     : process.env.DB_USERNAME,
						password : process.env.DB_PASSWORD,
						port     : process.env.DB_PORT,
						database : process.env.DB_DATABASE,
						pool	   : true  
					});


connection.connect(function(err) {
  if (err) throw err;

});

module.exports=connection;