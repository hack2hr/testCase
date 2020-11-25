'use strict';

var loginPage = angular.module('myApp.loginPage', ['ngRoute']);

loginPage.controller('LoginCtrl', function ($scope, userService, $rootScope, infoService, $window) {

    $scope.login = null;
    $scope.password = null;
    $scope.user = {};

    var localUser = localStorage.getItem("user"); //todo в будущем не будет пользователя в локальном хранилище он будет идентифицирован в куки в виде токена
    if(localUser){ //if user exits then retry login
        $rootScope.user = JSON.parse(localUser);
    }

    $scope.auth = function(){
        if($scope.login && $scope.password){
            userService.login($scope.login, $scope.password).then(function(user){
                if(user && user.user_id) {
                    $rootScope.user = user;
                    $scope.user = user;
                    localStorage.setItem("user", JSON.stringify(user));
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

    function toMain(){
        $window.location.hash = "#/users";
    }

});