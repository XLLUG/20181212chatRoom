/*
*
*@author xueyushuai
*/
var app = angular.module('app', ['ngRoute']);
app.controller('boxController', function ($scope, $rootScope, MessageService, $location,socket) {
    $scope.loginUser = null;
    $scope.loginShow = true;
    $scope.menue = '首页';
    if ($scope.loginUser && $scope.loginUser) {
        $scope.loginShow = false;
    }
    /* $scope.$on('menue',function (data) {
         $scope.menue=data;
     });*/
    /**
     * 退出后断开连接
     */
    $scope.logout = function () {
        $scope.menue = '退出';
        //断开socke.io连接
        socket.disconnect();
        MessageService.logout().then(function (data) {
            if (data.success) {
                $rootScope.user = null;
                $scope.loginUser = null;
                $location.path('/');
                //alert(data.info);
            }
        })
    }
})
    .controller('homeController', function ($scope, $rootScope, MessageService, socket,$location) {
        $scope.date = new Date();
        $scope.loginUser = null;
        $scope.loginUserList = null;
        $scope.messageList=[];
        //查找父级controller上的menue并赋值
        $scope.$parent.menue = '首页';
        //$scope.$emit('menue', '首页');
        /**
         * 登陆后将登陆人的信息显示，和在线人数显示
         */
        if ($rootScope.user) {
            $scope.$parent.loginUser = $rootScope.user;
            $scope.loginUser = $rootScope.user;
            if ($scope.loginUser != '' && $scope.loginUser != null) {
                socket.emit('user', $scope.loginUser)
            }
        } else {
            MessageService.getUserInfo().then(function (data) {
                $scope.$parent.loginUser = data;
                $scope.loginUser = data;
                if ($scope.loginUser != '' && $scope.loginUser != null) {
                    socket.emit('user', $scope.loginUser)
                }

            });
        }
        /**
         * 获取上线的人
         */
        socket.on('loginUser', function (msg) {
                console.log(msg);
                $scope.loginUserList = msg;
            }
        );
        /**
         * 获取聊天的消息，注意客户端和服务端emit消息时，消息名字要不一样，否则 前后端的事件都能监听到
         */
        socket.on('message',function (msg) {
            $scope.messageList.push(msg)
        });
        /**
         * 当有人退出时
         */
        socket.on('userRemoved',function (msg) {
           alert(msg.name+'已经退出');
            $scope.loginUserList = msg.userList;
        });
        /**
         * 点击发送消息
         * @param valid
         */
        $scope.sendMessage = function (valid) {
            if($scope.loginUser == '' || $scope.loginUser == null){
                $location.path('/login');
                alert('请登陆后发言');
            }
            if (valid) {
                socket.emit('clientMessage',$scope.message)
                $scope.message='';
            }

        };
    })
    .controller('loginController', function ($scope, MessageService, $rootScope, $location) {
        $scope.$parent.menue = '登陆';
        //$scope.$emit('menue', '登陆');
        $scope.user = {};
        $scope.login = function () {
            MessageService.login($scope.user).then(function (data) {
                if (data.success) {
                    console.log(data.info);
                    $rootScope.user = data.info;
                    $location.path('/home')

                } else {
                    alert(data.info)
                }
            })
        }
    })
    .controller('registerController', function ($scope, MessageService, $location) {
        $scope.$parent.menue = '注册';
        //$scope.$emit('menue', '注册');
        $scope.o = {};
        $scope.register = function (valid) {
            if (valid) {
                MessageService.register($scope.o).then(function (data) {
                    if (data.success) {
                        alert(data.info);
                        $location.path('/login')

                    } else {
                        alert(data.info)
                    }
                })
            }
        };

    })
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: '/views/login.html',
                controller: 'loginController'
            })
            .when('/register', {
                templateUrl: '/views/register.html',
                controller: 'registerController'
            })
            .otherwise({
                templateUrl: '/views/home.html',
                controller: 'homeController'
            })
    })
    .factory('MessageService', function ($http) {
        return {
            login: function (o) {
                return $http.post('/users/login', o).then(function (res) {
                    return res.data
                })
            },
            register: function (o) {
                return $http.post('/users/register', o).then(function (res) {
                    return res.data
                })
            },
            getUserInfo: function () {
                return $http.get('/users/userInfo').then(function (res) {
                    return res.data
                })
            },
            logout: function () {
                return $http.get('/users/logout').then(function (res) {
                    return res.data
                })
            }
        }
    })
    .factory('socket', function ($rootScope) {
        var socket = io.connect();
        socket.on('connect', function () {
            console.log('连接成功')
        });
        return {
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {//手动执行脏检查
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    })
                })

            },
            /*
            * Angular只能管理它所已知的行为触发方式，而不能涵盖所有的Angular操作场景。
            * 这就为什么我们在封装第三方jQuery插件时，不能自动更新视图，
            * 而需要我们手动调用$scope.$apply。
            *
            * */
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {   //手动执行脏检查，
                        callback.apply(socket, args);
                    });
                })

            },
            disconnect:function () {
                socket.disconnect();
            }
        }
    });