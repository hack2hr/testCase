'use strict';

var mainPage = angular.module('myApp.loginPage', ['ngRoute']);

mainPage.controller('LoginCtrl', function ($scope, mainService, $rootScope, infoService, $window) {

    // временно стоит заглушка на пользователей (данные синхронизированы с базой )

    $scope.adminUser =   { login:"admin", password:"admin", surname:"admin1",name:"admin2",secname:"admin3",email:"admin@email",rank:"admin",status:" - ", isAdmin:true}
    $scope.defaultUser = { login:"user", password:"user", surname:"user1",name:"user12",secname:"user13",email:"user1@email",rank:"user1",status:" - ", isAdmin:false}

    $scope.login = "";
    $scope.password = "";

    var localUser = localStorage.getItem("user"); //todo в будущем не будет пользователя будет куки и токен
    if(localUser){
        $rootScope.user = JSON.parse(localUser);
        toMain();
    }

    $scope.authorize = function(){
        if($scope.login == $scope.adminUser.login && $scope.password == $scope.adminUser.password){
            $rootScope.user = $scope.adminUser;
            toMain();
        } else {
            if($scope.login == $scope.defaultUser.login && $scope.password == $scope.defaultUser.password){
                $rootScope.user = $scope.defaultUser;
                toMain();
            } else{
                infoService.infoFunction("Неверный логин или пароль", "Ошибка")
            }
        }
    }

    function toMain(){
        if($rootScope.user ) {
            localStorage.setItem("user", JSON.stringify($rootScope.user));
        }
        $window.location.hash = "#/main";
    }

});