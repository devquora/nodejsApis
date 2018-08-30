'use strict';
 const DB = require('../config/database');
 let JWTM = require('../middlewares/verifyAuthToken');


exports.saveProfile=function(req, res){
  let userInfo =JWTM.getLoggedInUser(req);
  let sql = "UPDATE `wf_supplier_professional` SET `company_ceo` ='"+req.body.company_ceo+"',`year_establishment` ='"+req.body.year_establishment+"', no_of_employee='"+req.body.no_of_employee+"', turnover='"+req.body.turnover+"', company_profile='"+req.body.company_profile+"' WHERE `wf_supplier_professional`.`id` =" + req.body.company_id;

   DB.query(sql, function(err, company) {
                if (err) {
                    return res.status(401).send({
                        status: false,
                        message: "Error in query.",
                        statusCode: 401,
                        data: err
                    });
                } else {
                 
                    return res.status(200).send({
                        status: true,
                        message: "Company Profile Saved Successfully",
                        statusCode: 200,
                        data: {
                            company_id  : req.body.company_id,
                            company_ceo:  req.body.company_ceo,
                         }
                    });

                }
            });

}

exports.create = function(req, res) {
   let userInfo =JWTM.getLoggedInUser(req);
   let sql = "INSERT INTO wf_supplier_professional (`business_type`,`company_name`,`company_type`,`user_id`,`package_id`,`legal_status`) VALUES ('" + req.body.business_type + "', '" + req.body.company_name + "', '" + req.body.company_type + "'," + userInfo._id + "," + req.body.package_id + ",'" + req.body.legal_status + "')";            
            DB.query(sql, function(err, company) {
                if (err) {
                    return res.status(401).send({
                        status: false,
                        message: "Error in query.",
                        statusCode: 401,
                        data: err
                    });
                } else {
                  
                    return res.status(200).send({
                        status: true,
                        message: "Company Created Successfully",
                        statusCode: 200,
                        data: {
                            company_id  : company.insertId,
                            company_name: req.body.company_name,
                            company_type: req.body.company_type,
                            business_type: req.body.business_type,
                            package_id: req.body.package_id,
                            user_id: userInfo._id,
                            legal_status: req.body.legal_status,
                        }
                    });

                }
            });


};




