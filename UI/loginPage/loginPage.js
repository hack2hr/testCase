'use strict';

var loginPage = angular.module('myApp.loginPage', ['ngRoute']);

loginPage.controller('LoginCtrl', function ($scope, userService, $rootScope, infoService, $window) {

    $scope.login = null;
    $scope.password = null;
    $scope.user = {};

    var token = getCookieByName("token"); //todo в будущем не будет пользователя в локальном хранилище он будет идентифицирован в куки в виде токена
    if(token){ //if user exits then retry login
        getUserByToken(token);
    }

    function getUserByToken(){
        userService.getUserByToken(token).then(function(response){
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
                    setCookie("token", response.token, expiration)
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

    function setCookie(name,value,expiration){
        var expires = "";
        if (expiration) {
            var date = new Date(expiration);
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/ ;"
        //document.cookie = name + "=" + (value || "")  + expires + "; path=/ ;domain=localhost";
    }

    function getCookieByName(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
        else return null;
    }

    function deleteTokenFromCookie(){
        document.cookie = "token=''; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; ";
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