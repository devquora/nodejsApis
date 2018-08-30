'use strict';
const validate = require('express-validation');
let Joi = require('joi');

let schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()

});

let signupSchema = Joi.object().keys({
    name: Joi.string().min(4).required().error(
            new Error('Please enter valid name.')
        ),
    mobile: Joi.string()
        .regex(/^(\+\d{1,3}[- ]?)?\d{10}$/)
        .required().error(
            new Error('Please enter valid 10 digit mobile no.')
        ),
    gcm_id:Joi.string().required().error(
            new Error('GCM id is required.')
        ),
    device_id:Joi.string().required().error(
            new Error('Device id is required.')
        ),

});


let otpSchema = Joi.object().keys({
    otp:   Joi.string().min(4).max(4).required().error(
            new Error('Please enter valid 4 digit OTP.')
        ),
    user_id:   Joi.string().required().error(
            new Error('User id is required.')
        ),
    email: Joi.string().email().required().error(
            new Error('Please enter valid email.')
        ),
    password: Joi.string().required().error(
                new Error('Password is required.')
        )
});

let mobileSchema = Joi.object().keys({

    mobile: Joi.string()
        .regex(/^(\+\d{1,3}[- ]?)?\d{10}$/)
        .required().error(
            new Error('Please enter valid 10 digit mobile no.')
        )

});

exports.signIn = function(req, res, next) {
    let data = req.body;
    let err = Joi.validate(data, schema);
    if (err) {
        if (err.error) {
            return res.status(422).send({
                status: false,
                message: err.error.details[0].message,
                statusCode: 422,
                data: {}
            });


            return false;
        }
    }

    next();
}

exports.verifyOTP = function(req, res, next) {
    let data = req.body;
    let err = Joi.validate(data, otpSchema);

    if (err) {
        if (err.error) {
            return res.status(422).send({
                status: false,
                message: err.error.message,
                statusCode: 422,
                data: {}
            });


            return false;
        }

    }
    next();
}


exports.validateMobile = function(req, res, next) {
    let data = req.body;
    let err = Joi.validate(data, mobileSchema);

    if (err) {
        if (err.error) {
            return res.status(422).send({
                status: false,
                message: err.error.message,
                statusCode: 422,
                data: {}
            });


            return false;
        }

    }
    next();
}

exports.signUp = function(req, res, next) {
    let data = req.body;
    let err = Joi.validate(data, signupSchema);
    if (err) {

        if (err.error) {
            let error_message = "";
            if (err.error.details) {
                error_message = err.error.details[0].message;
            } else {
                error_message = err.error.message;
            }
            return res.status(422).send({
                status: false,
                message: error_message,
                statusCode: 422,
                data: {}
            });

            return false;
        }
    }
    next();
}


//module.exports =validateLogin ;