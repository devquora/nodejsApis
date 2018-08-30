'use strict';
let jwt = require('jsonwebtoken');
exports.getLoggedInUser=function(req){
	    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        // Handle token presented as a Bearer token in the Authorization header
       return jwt.verify(req.headers.authorization.split(' ')[1], process.env.APP_HASH,
            function(err, userInfo) {
              				
                    return userInfo;
               

            });



    } else {
        return res.status(401).send({
            status: false,
            message: "An authorization token is required.",
            statusCode: 401,
            data: {}
        });

    }

}


exports.verifyAuthToken = function(req, res, next) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        // Handle token presented as a Bearer token in the Authorization header
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.APP_HASH,
            function(err, decoded) {
                if (err) {
                    return res.status(401).send({
                        status: false,
                        message: "Invalid authorization token.",
                        statusCode: 401,
                        data: {}
                    });
                } else {
                    next();
                }

            });



    } else {
        return res.status(401).send({
            status: false,
            message: "An authorization token is required.",
            statusCode: 401,
            data: {}
        });

    }
  

}