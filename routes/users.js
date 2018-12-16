var express = require('express');
var router = express.Router();
var Model = require('../model');
var User = Model.User;

/* GET users listing. */
router.post('/register', function (req, res, next) {
    if (req.body.repassword != req.body.repassword) {
        res.send({'success': false, "info": '确保两次输入的密码一样'});
        return
    }
    User.create(req.body, function (error, doc) {
        if (doc) {
            res.send({'success': true, "info": '注册成功，请登录'});
        }
    })

});
router.post('/login', function (req, res, next) {
    User.findOne({username: req.body.username, password: req.body.password}, function (error, doc) {
        if (error) {
            res.send({'success': false, "info": '请输入正确的账户名和密码'});
        } else {
            console.log(doc);
            /**
             * { _id: 5c1517327fdde63b847fd40c,
                  username: '薛煜帅',
              email: '1499115658@qq.com',
              password: 'e10adc3949ba59abbe56e057f20f883e',
               __v: 0 }
             */
            if (doc) {
                req.session.user = doc;
                res.send({'success': true, "info": {username: doc.username, email: doc.email}});
            } else {
                res.send({'success': false, "info": '请输入正确的账户名和密码'});
            }
        }
    })

});
router.get('/userInfo', function (req, res, next) {
if(req.session.user){
    res.send({username: req.session.user.username, email: req.session.user.email})
}else {
    res.send(req.session.user);
}

});
router.get('/logout', function (req, res, next) {
      req.session.user=null;
      res.send({"success":true,'info':'退出成功'});
});

module.exports = router;
