"use strict";

var app = angular.module('testPageApp', []);

app.controller('testPageCtrl', function($scope, $http) {
    // Items necessary variables
    $scope.items = [];
    $scope.selectedItemId = null;
    // Get saved data from json
    $http.get('https://api.myjson.com/bins/134gex').success(function(response) {
        $scope.items = response;
        $scope.dataLoaded = true;
    });
    // Add items on keys [Ctrl+Enter]
    $scope.submitAddItem = function() {
        if (event.ctrlKey && event.keyCode === 13) {
            $scope.addItem();
        }
    };
    //Add items function
    $scope.addItem = function() {
        if ($scope.itemName !== '' && $scope.itemName !== undefined) {
            if ($scope.items.length > 0) {
                $scope.itemId = $scope.items[$scope.items.length - 1].id + 1;
            } else {
                $scope.itemId = 1;
            }
            $scope.item = {
                id: $scope.itemId,
                name: $scope.itemName,
                date: new Date(),
                comments: []
            };
            $scope.items.push($scope.item);
            $scope.itemName = '';
            $scope.updateData();
        }
    };
    // Remove item function
    $scope.removeItem = function(id) {
        $scope.selectedObj = $scope.getItemById(id);
        $scope.selectedIndex = $scope.items.indexOf($scope.selectedObj[0]);
        $scope.items.splice($scope.selectedIndex, 1);
        if ($scope.selectedItemId === id) {
            $scope.selectedItemId = null;
        }
        $scope.getComments();
        $scope.updateData();
    };
    // Identify selected item
    $scope.selectItem = function(id) {
        $scope.selectedItemId = id;
    };
    // Add comment on keys [Ctrl+Enter] function
    $scope.addComment = function() {
        if (event.ctrlKey && event.keyCode === 13 && $scope.items.length !== 0 && $scope.commentMassage !== '' && $scope.selectedItemId !== null) {
            $scope.itemObj = $scope.getItemById($scope.selectedItemId);
            $scope.comment = {
                massage: $scope.commentMassage,
                date: new Date()
            };
            $scope.itemObj[0].comments.push($scope.comment);
            $scope.commentMassage = '';
            $scope.updateData();
        }
    };
    // Get comments function
    $scope.getComments = function() {
        if ($scope.items.length !== 0 && $scope.selectedItemId !== null) {
            $scope.itemObj = $scope.getItemById($scope.selectedItemId);
            return $scope.itemObj[0].comments;
        }
    };
    // Get item by id from items
    $scope.getItemById = function(id) {
        $scope.findedItem = $scope.items.filter(function(obj) {
            return obj.id == id;
        });
        return $scope.findedItem;
    };
    // Update json data
    $scope.updateData = function() {
        $scope.prepareJson = JSON.stringify($scope.items);
        $http.put('https://api.myjson.com/bins/134gex', $scope.prepareJson);
    };
});