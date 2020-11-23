'use strict';

var loginPage = angular.module('myApp.loginPage', ['ngRoute']);

loginPage.controller('LoginCtrl', function ($scope, userService, $rootScope, infoService, $window) {

    $scope.login = null;
    $scope.password = null;

    var localUser = localStorage.getItem("user"); //todo в будущем не будет пользователя будет куки и токен
    if(localUser){ //if user exits then retry login
        $rootScope.user = JSON.parse(localUser);
    }

    $scope.auth = function(){
        if($scope.login && $scope.password){
            userService.login($scope.login, $scope.password).then(function(response){
                if(response) {
                    console.log(response);
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

    function tryDigest() {
        if (!$rootScope.$$phase) {
            $rootScope.$apply();
        }
    }

    function toMain(){
        if($rootScope.user ) {
            localStorage.setItem("user", JSON.stringify($rootScope.user));
        }
        $window.location.hash = "#/users";
    }

});