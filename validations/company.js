'use strict';
const validate = require('express-validation');
let Joi = require('joi');

let step1Schema =  Joi.object().keys({
    company_name : Joi.string().required().error(
            new Error('Company Name is required.')
        ),
    business_type: Joi.string().required().error(
            new Error('Business type is required.')
        ),
    company_type : Joi.string().required().error(
            new Error('Company type is required.')
        ),
    package_id   : Joi.string().required().error(
            new Error('Package id is required.')
             ),
    legal_status   : Joi.string().required().error(
            new Error('Company Legal Status is required.')
             )
    
});

let step2Schema =  Joi.object().keys({

    company_id : Joi.string().required().error(
            new Error('A valid company id is required to proceed.')
        ),
    company_ceo : Joi.string().required().error(
            new Error('Company ceo name is required.')
        ),
    year_establishment: Joi.string().required().error(
            new Error('Please select year of establishment.')
        ),
    no_of_employee : Joi.string().required().error(
            new Error('Please select number of employees .')
        ),
    turnover      : Joi.string().required().error(
            new Error('Please select your company turnover.')
        ),
    cities_serve  : Joi.string().required().error(
            new Error('Please select cities you serve.')
             ),
    company_profile   : Joi.string().required().error(
            new Error('Company Profile is required.')
             )
    
});




exports.step2 = function(req, res, next) {
    let data = req.body;
    let err = Joi.validate(data, step2Schema);
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



exports.step1 = function(req, res, next) {
    let data = req.body;
    let err = Joi.validate(data, step1Schema);
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
