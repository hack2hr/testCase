'use strict';

var loginPage = angular.module('myApp.loginPage', ['ngRoute']);

loginPage.controller('LoginCtrl', function ($scope, userService, $rootScope, infoService) {

    $scope.login = null;
    $scope.password = null;
    $scope.user = {};

    var token = userService.getCookieByName("token");
    if(token){ //if user exits then retry login
        getUserByToken(token);
    }

    function getUserByToken(){
        userService.getUserByToken().then(function(response){
            if(response && response.token) {
                $rootScope.user = response.user;
                $scope.user = response.user;
                localStorage.setItem("user", JSON.stringify(response));
            } else {
                infoService.infoFunction(response.message, "Ошибка")
            }
        });
    }

    $scope.auth = function(){
        if($scope.login && $scope.password){
            userService.login($scope.login, $scope.password).then(function(response){
                if(response && response.token) {
                    var expiration = new Date();
                    expiration = new Date(expiration.setDate(expiration.getDate()+1));
                    userService.setCookie("token", response.token, expiration)
                    $rootScope.user = response.user;
                    $scope.user = response.user;
                    localStorage.setItem("user", JSON.stringify(response));

                } else {
                    infoService.infoFunction(response.message, "Ошибка")
                }
            });
            //toMain();
        } else {
            $scope.isLoginError = true;
            setTimeout(function (){
                $scope.isLoginError = false;
                tryDigest();
            }, 1500)
        }
    }



    $scope.createUser = function(){
        userService.addUserModal().then(function (){

        })
    }

    $scope.editUser = function (){
        userService.editUserModal($scope.user).then(function (){
        })
    }

    function tryDigest() {
        if (!$rootScope.$$phase) {
            $rootScope.$apply();
        }
    }


});