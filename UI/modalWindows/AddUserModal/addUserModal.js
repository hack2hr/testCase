
var addUserModal = angular.module('myApp.addUserModalModal', ['ngRoute', 'ui.bootstrap']);

addUserModal.controller('AddUserModalCtrl', function ($scope, $uibModalInstance, addUserModalService) {

    $scope.newUser = {};

    $scope.addUser = function(){
        $scope.newUser.isAdmin = $scope.newUser.isAdmin === undefined ? false : $scope.newUser.isAdmin;
        addUserModalService.addUser($scope.newUser).then(function(result){
            $uibModalInstance.close(result);
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