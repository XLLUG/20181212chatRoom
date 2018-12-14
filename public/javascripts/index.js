/*
*
*@author xueyushuai
*/
var app = angular.module('app', ['ngRoute']);
    app.controller('boxController', function ($scope) {
        $scope.menue = '首页';

    })
    .controller('homeController', function ($scope) {
        $scope.date = new Date();

    })
    .controller('loginController', function ($scope) {

    })
    .controller('registerController', function ($scope) {

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
            .otherwise( {
                templateUrl: '/views/home.html',
                controller: 'homeController'
            })
    });