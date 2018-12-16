/*
*
*@author xueyushuai
*/
var mongoose =require('mongoose');
var dbConfig=require('../dbConfig');
var db=mongoose.connect(dbConfig.url,dbConfig.options);
var objectId = mongoose.Schema.Types.ObjectId;
db.then(function () {
   console.log('数据库连接成功')
}).catch(function (error) {
    console.log('数据库连接失败'+error)
});
var User = mongoose.model('users',new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    createTime:{type:Date,Default:Date.now()}
}));
exports.User=User;