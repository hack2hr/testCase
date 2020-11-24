
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