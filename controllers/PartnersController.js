'use strict';
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const DB = require('../config/database');
const msg91 = require("msg91")("177499AETjlaQKt8d59d35b4e", "WFMIND", 4);

exports.index = function(req, res) {
    Users.findById(1, function(err, users) {
        res.send(users);
    });
    console.log('index');
};

function generatePassword(pwd) {

    let hash = bcrypt.hashSync(pwd, 10);
    return hash;
};


exports.listBusinessTypesById=function(req,res){
    let parent_id=req.params.id;
    let sql = "SELECT * FROM `wf_business_type` where parent_id="+parent_id;
    DB.query(sql, function(err, business_types) {
        if (err) {
            return res.status(401).send({
                status: false,
                message: "Error in query.",
                statusCode: 401,
                data: {}
            });
        }else{
            return res.status(200).send({
                status: true,
                message: "Success, business list.",
                statusCode: 200,
                data: business_types
            });

        }
    });

}
exports.listBusinessTypes=function(req,res){
    let sql = "SELECT * FROM `wf_business_type` where parent_id=0";
    DB.query(sql, function(err, business_types) {
        if (err) {
            return res.status(401).send({
                status: false,
                message: "Error in query.",
                statusCode: 401,
                data: {}
            });
        }else{
            return res.status(200).send({
                status: true,
                message: "Success, business list.",
                statusCode: 200,
                data: business_types
            });

        }
    });

}

exports.verifyOTP = function(req, res) {
    let  OTP = req.body.otp,
       email_id = req.body.email,
     user_id = req.body.user_id;
     let sql = "select * from wf_users where id= '" + user_id + "'";
    DB.query(sql, function(err, user) {
        if (err) {
            return res.status(401).send({
                status: false,
                message: "Error in query.",
                statusCode: 401,
                data: {}
            });

        } else if (user[0]){

               sql = "select * from wf_users where email= '" + email_id + "'";

               DB.query(sql, function(err, email) {
                        if (err) {
                            return res.status(401).send({
                                status: false,
                                message: "Error in query.",
                                statusCode: 401,
                                data: {}
                            });
                        }
              if(email[0]){
                      return res.status(422).send({
                                status: false,
                                message: "Email already is use.",
                                statusCode: 422,
                                data: {}
                       });
               }else if (user[0].otp == OTP) {
                let user_id = user[0].id;
                // perform otp update in db
                let password = generatePassword(req.body.password);

                sql = "UPDATE `wf_users` SET `mobile_verified` =1, email='"+email_id+"', password='"+password+"' WHERE `wf_users`.`id` =" + user_id;
                DB.query(sql, function(err, result) {
                    if(err){
                        return res.status(401).send({
                            status: false,
                            message: "Error in query.",
                            statusCode: 401,
                            data: err
                        });
                    } else {
                        if (result.affectedRows > 0) {
                            let token = jwt.sign({
                                email: email_id,
                                name: user[0].name,
                                _id: user[0].id
                            }, process.env.APP_HASH);
                            let responseData = new Object();
                            responseData.name = user[0].name;
                            responseData.email = email_id;
                            responseData.status = user[0].status;
                            responseData.token = token;

                            return res.status(200).send({
                                status: true,
                                message: "Mobile verified successfully. Logging In user.",
                                statusCode: 200,
                                data: responseData
                            });


                        }
                    }
                });
            } else {
                return res.status(401).send({
                    status: false,
                    message: "Invalid otp.",
                    statusCode: 401,
                    data: {}
                });

            }
           });


        } else {

            return res.status(401).send({
                status: false,
                message: "Invalid user.",
                statusCode: 401,
                data: {}
            });

        }
    });

}

exports.resendOTP = function(req, res) {
    let OTP = Math.floor(1000 + Math.random() * 9000);
    let sql = "select * from wf_users where phone= '" + req.body.mobile + "'";
    DB.query(sql, function(err, user) {
        if (err) {
            return res.status(401).send({
                status: false,
                message: "Error in query.",
                statusCode: 401,
                data: {}
            });
        }

        if (user[0]) {
            let user_id = user[0].id;
            // perform otp update in db
            sql = "UPDATE `wf_users` SET `otp` =" + OTP + " WHERE `wf_users`.`id` =" + user_id;
            DB.query(sql, function(err, result) {
                if (err) {
                    return res.status(401).send({
                        status: false,
                        message: "Error in query.",
                        statusCode: 401,
                        data: {}
                    });
                } else {
                    if (result.affectedRows > 0) {
                        msg91.send(req.body.mobile, "Your 4 digit OTP for WFM Supplier registration is " + OTP, function(err, response) {
                            if (err) {
                                return res.status(401).send({
                                    status: false,
                                    message: "Error in sending OTP.",
                                    statusCode: 401,
                                    data: {}
                                });
                            } else {
                                return res.status(200).send({
                                    status: true,
                                    message: "Otp sent Successfully",
                                    statusCode: 200,
                                    data: {}
                                });
                            }

                        });
                    }
                }
            });


        } else {
            return res.status(401).send({
                status: false,
                message: "Mobile no. is not registered with us.",
                statusCode: 401,
                data: {}
            });
        }

    });

}
let comparePassword = function(pwd, password) {
    let hash = password;
    let new_hash = hash.replace("$2y$", "$2b$");
    return bcrypt.compareSync(pwd, new_hash);
};


exports.checkMobileAvailability = function(req, res) {
    let sql = "select * from wf_users where phone= '" + req.body.mobile + "'";
    DB.query(sql, function(err, user) {
        if (err) {
            return res.status(401).send({
                status: false,
                message: "Error in query.",
                statusCode: 401,
                data: {}
            });
        }

        if (!user[0]) {
            return res.status(200).send({
                status: true,
                message: "Mobile no. is available",
                statusCode: 200,
                data: {}
            });

        } else if (user[0]) {

           return res.status(401).send({
                status: false,
                message: "Mobile no. is already registered.",
                statusCode: 401,
                data: {}
            });
        }

    });

};

exports.signin = function(req, res) {
    let sql = "select * from wf_users where email= '" + req.body.email + "'";
    DB.query(sql, function(err, user) {
        if (err) {
            return res.status(401).send({
                status: false,
                message: "Error in query.",
                statusCode: 401,
                data: {}
            });
        }


        if (!user[0]) {
            return res.status(401).send({
                status: false,
                message: "Authentication failed. Email not found.",
                statusCode: 401,
                data: {}
            });

        } else if (user[0]) {

            if (!comparePassword(req.body.password, user[0].password)) {

                return res.status(401).send({
                    status: false,
                    message: "Authentication failed. Wrong password.",
                    statusCode: 401,
                    data: {}
                });

            } else {
                let token = jwt.sign({
                    email: user[0].email,
                    name: user[0].name,
                    _id: user[0].id
                }, process.env.APP_HASH);
                let responseData = new Object();
                responseData.user_id = user[0].id;
                responseData.name = user[0].name;
                responseData.email = user[0].email;
                responseData.status = user[0].status;
                responseData.token = token;


                return res.status(200).send({
                    status: true,
                    message: "Logged In Successfully.",
                    statusCode: 200,
                    data: responseData
                });

            }
        }


    });


};

exports.signup = function(req, res) {

    let sql = "select * from wf_users where phone= '" + req.body.mobile + "'";
    DB.query(sql, function(err, user) {
        if (err) {
            return res.status(401).send({
                status: false,
                message: "Error in query.",
                statusCode: 401,
                data: err
            });
        }

        if (!user[0]) {

            sql = "INSERT INTO wf_users (name, phone, active, activated,gcm_id,device_id) VALUES ('" + req.body.name + "', '" + req.body.mobile + "',0,0, '" + req.body.gcm_id + "', '" + req.body.device_id + "')";

            DB.query(sql, function(err, newUser) {
                if (err) {
                    return res.status(401).send({
                        status: false,
                        message: "Error in query.",
                        statusCode: 401,
                        data: err
                    });
                } else {

                    let OTP = Math.floor(1000 + Math.random() * 9000);

                    let user_id = newUser.insertId;
                    // perform otp update in db
                    sql = "UPDATE `wf_users` SET `otp` =" + OTP + " WHERE `wf_users`.`id` =" + user_id;
                    DB.query(sql, function(err, result) {
                        if (err) {
                            return res.status(401).send({
                                status: false,
                                message: "Error in query.",
                                statusCode: 401,
                                data: err
                            });
                        } else {
                            if (result.affectedRows > 0) {
                                msg91.send(req.body.mobile, "Thanks for registering with WFM.Your OTP for Supplier registration is " + OTP, function(err, response) {
                                    if (err) {
                                        return res.status(401).send({
                                            status: false,
                                            message: "Error in sending OTP.",
                                            statusCode: 401,
                                            data: err
                                        });
                                    } else {
                                        return res.status(200).send({
                                            status: true,
                                            message: "User Registered Successfully",
                                            statusCode: 200,
                                            data: {
                                                name: req.body.name,
                                                phone: req.body.mobile,
                                                user_id: newUser.insertId
                                            }
                                        });
                                    }

                                });
                            }
                        }
                    });

                }


            });


        } else if (user[0]) {
            return res.status(401).send({
                status: false,
                message: "Mobile no. is already registered.",
                statusCode: 401,
                data: {}
            });
        }

    });

};