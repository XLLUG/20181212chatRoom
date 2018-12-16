/*
*
*@author xueyushuai
*/
var MD5 = require('../util').MD5;
module.exports = function () {
    return function (req, res, next) {
        console.log(req.body);
        if (req.body.password) {
            req.body.password = MD5(req.body.password);
        };
        if (req.body.repassword) {
            req.body.repassword = MD5(req.body.repassword);
        }
        next()

        /* MD5()*/

    }
};