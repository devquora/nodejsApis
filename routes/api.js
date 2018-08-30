'use strict';
module.exports = function(app, connection) {
    const Partners = require('../controllers/PartnersController');
    const Company = require('../controllers/CompanyController');
    const validate = require('express-validation');
    const userValidations  = require('../validations/users');
    const companyValidations  = require('../validations/company');
    const JWTM  = require('../middlewares/verifyAuthToken');
    app.route('/signin')
        .post(userValidations.signIn, Partners.signin);

    app.route('/validate-mobile')
        .post(userValidations.validateMobile, Partners.checkMobileAvailability);

    app.route('/signup')
        .post(userValidations.signUp, Partners.signup);

    app.route('/verify-otp')
        .post(userValidations.verifyOTP,Partners.verifyOTP);

    app.route('/resend-otp')
        .post(Partners.resendOTP);

    app.route('/business-type')
        .get(JWTM.verifyAuthToken,Partners.listBusinessTypes);

    app.route('/company')
    .post(JWTM.verifyAuthToken,companyValidations.step1,Company.create);

    app.route('/company/save-profile')
    .post(JWTM.verifyAuthToken,companyValidations.step2,Company.saveProfile);

    app.route('/business-type/:id')
    .get(JWTM.verifyAuthToken,Partners.listBusinessTypesById);
}