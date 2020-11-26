
var addUserModal = angular.module('myApp.addUserModalModal', ['ngRoute', 'ui.bootstrap']);

addUserModal.controller('AddUserModalCtrl', function ($scope, $uibModalInstance, userService) {

    $scope.newUser = {};

    $scope.addUser = function(){
        $scope.newUser.isAdmin = $scope.newUser.isAdmin === undefined ? false : $scope.newUser.isAdmin;
        userService.addUser($scope.newUser).then(function(result){
            $uibModalInstance.close(result);
        }, function(error) {
            console.error('AddUserModalCtrl: ', error);
        });
    }

    $scope.userRoles = [{userrole_id:1, userrole_name:'Пользователь'}];
    $scope.newUser.role = $scope.userRoles[0];
    getAllUserRoles();
    function getAllUserRoles(){
        userService.getAllUserRoles().then(function(result){
            $scope.userRoles = result;
        }, function(error) {
            console.error('AddUserModalCtrl: ', error);
        });
    }

    $scope.close = function () {
        close();
    };

    function  close(){
        $uibModalInstance.close();
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});