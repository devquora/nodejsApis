require('dotenv').config();
const createError = require('http-errors'),
 express          = require('express'),
 path             = require('path'),
 bodyParser       = require('body-parser'),
 logger           = require('morgan'),
 app         = express();
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended:true}));
 require('./routes/api')(app, express);
 port = process.env.PORT || 3000;
 app.listen(port);
 console.log('Server started on: http://45.118.135.192:' + port);