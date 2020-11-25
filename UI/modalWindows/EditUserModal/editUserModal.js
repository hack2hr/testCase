
var editUser = angular.module('myApp.editUserModalModal', ['ngRoute', 'ui.bootstrap']);

editUser.controller('EditUserModalCtrl', function ($scope, $uibModalInstance, user, userService) {

    $scope.newUser = JSON.parse(JSON.stringify(user));

    $scope.editUser = function(){
        userService.editUser($scope.newUser).then(function(result){
            $uibModalInstance.close(result);
        }, function(error) {
            console.error('EditUserModalCtrl     editUser: ', error);
        });
    }

    $scope.userRoles = [{userrole_id:1, userrole_name:'Пользователь'}];
    $scope.newUser.role = $scope.userRoles[0];

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