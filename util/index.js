/*
*
*@author xueyushuai
*/
var crypto =require('crypto');
exports.MD5=function (input) {
      return crypto.createHash('md5').update(input).digest('hex')
};
