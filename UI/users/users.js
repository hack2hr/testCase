'use strict';

var users = angular.module('myApp.users', ['ngRoute']);

users.controller('UsersCtrl', function ($scope, userService) {
    uploadUsers();

    function uploadUsers() {
        userService.getAllUsers().then(function (response) {
            $scope.users = response;
        }, function(error) {
            console.error(error);
        });
    }


    $scope.deleteUser = function(user){
        userService.deleteUser({
            '_id': user._id.$oid
        }).then(function (result) {
            if (result) {
                uploadUsers();
            }
        }), function(error) {
            console.error('UsersCtrl     deleteUser: ', error);
        };
    }

    $scope.editUser = function(user){
        userService.editUserModal(user).then(function(result){
            if (result) {
                uploadUsers();
            }
        }, function(error) {
            console.error('UsersCtrl     editUserModal: ', error);
        })
    }

    $scope.addUserModal = function(){
        userService.addUserModal().then(function(result) {
            if (result) {
                uploadUsers();
            }
        }, function(error) {
            console.error('UsersCtrl     addUserModal: ', error);
        })
    }

});