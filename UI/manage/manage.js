'use strict';

var manage = angular.module('myApp.manage', ['ngRoute']);

manage.controller('ManageCtrl', function ($scope, $rootScope, $window, infoService, modelService) {

    $scope.category = $rootScope.category;
    $scope.currentYear = new Date().getFullYear();
    $scope.q1 = 0;
    $scope.q2 = 0;
    $scope.q3 = 0;
    $scope.q4 = 0;
    $scope.years = {};

    if(!$scope.category || !$rootScope.category) $window.location.hash = "#/main";

    // setDefaultQuartals();
    // function setDefaultQuartals(){
    //     if($scope.category.years){
    //         var yearVal = $scope.category.years[$scope.currentYear];
    //         $scope.q1=$scope.q2=$scope.q3=$scope.q4 = Number(yearVal/4).toFixed(1); //4 quart in year
    //     }
    // }

    $scope.graph = {};
    $scope.selectYear = function(year){
        $scope.currentYear = year;
        fillQuartals();
        // setDefaultQuartals();
    }

    $scope.models = [
        {title:"Линейная регрессия", name: 'linear'},
        {title:"С использованием экспоненты", name: 'exponential'},
        {title:"Логарифмическая", name: 'logarithmic'},
        {title:"Нормативная", name: 'default'}
    ];

    $scope.functions = [
        {title: 'hh', name: 'hh.ru'}
    ];

    var dynamicColors = function() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    };

    function setDataSet(){
        var dataset = [];
        var data = {type: 'line', backgroundColor:"rgb(0,190,255)", label: $scope.category.name, data: Object.values($scope.graph) };
        dataset.push(data);
        return dataset;
    }
    $scope.yearsGraph = []
    var years = [];

    setYears();
    function setYears(){
        var currentYear = new Date().getFullYear();
        var beforeDate = currentYear;
        var afterDate = currentYear;
        $scope.yearsGraph.push(afterDate);
        years.push(afterDate);
        for(var i=0; i < 6; i++){
            beforeDate--;
            afterDate++;
            $scope.yearsGraph.push(afterDate);
            $scope.yearsGraph.unshift(beforeDate);
            years.push(afterDate);
            years.unshift(beforeDate);
        }
    }

    $scope.drawChart = function(){
        drawChart();
    }

    var barChart = null;

    function drawChart(){
        if(barChart!=null) barChart.destroy();
        var chartData = {
            labels: years,
            datasets: setDataSet()
        };

        var ctx = document.getElementById('canvas').getContext('2d');
        ctx.height = 500;
        barChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                title: {
                    position:'left',
                    display: true,
                    text: 'Отрасль'
                },
                //tooltips: {
                //    mode: 'index',
                //    intersect: true
                //}
            }
        });
    }

    $scope.prediction = {};
    $scope.subCategories = $rootScope.subCategories;
    Object.keys($scope.subCategories).forEach(function(sub) {
        $scope.subCategories[sub].isSelected = true;
    });
    $scope.model = {selected: $scope.models[0]};
    $scope.func = {selected: $scope.functions[0]};

    function fillPredictionData(prediction) {
        var QUATERS_AMOUNT = 4;
        $scope.yearsGraph.forEach(function(year) {
            if (year <= $scope.currentYear) {
                $scope.graph[year] = $scope.category.years[year];
            } else {
                var quaters = prediction.slice(0, QUATERS_AMOUNT);
                prediction = prediction.slice(QUATERS_AMOUNT);

                var total = quaters.reduce(function(sum, value) {
                    return sum + value
                }, 0);

                $scope.graph[year] = (total / QUATERS_AMOUNT).toFixed(2);
                $scope.prediction[year] = quaters.map(function (value) {
                    return value.toFixed(2);
                });
            }
        });
    }

    var firstEnter = true;
    $scope.getPredictionByModel = function() {
        if($scope.model &&  $scope.model.selected  &&  $scope.model.selected.title) {

            var selectedSubCategories = Object.keys($scope.subCategories).filter(function(sub) {
                return $scope.subCategories[sub].isSelected;
            });

            modelService.predict({
                year: $scope.currentYear,
                yearsRange: 6,
                modelValue: $scope.model.selected.name,
                dataY: $scope.category.id,
                dataX: selectedSubCategories
            }).then(function(prediction) {
                fillPredictionData(prediction);

                if ($scope.isAccepted || firstEnter) {
                    drawChart();
                }

                if(!firstEnter) infoService.infoFunction("По модели '" + $scope.model.selected.title + "' получены показатели Квартала 1: <b>"+$scope.prediction[currentYear][0]
                    +"</b>. Квартала 2: <b>" + $scope.prediction[currentYear][1]+"</b>. Квартала 3: <b>"+$scope.prediction[currentYear][2]+"</b>. Квартала 4: <b>"+$scope.prediction[currentYear][3]+".", "Автоматический расчет");
                firstEnter = false;
            }, function(error) {
                console.error('Error in predicting model: ', error);
            });
        }
    }
    $scope.getPredictionByModel();

    $scope.reBuildModel = function (category) {
        category.isSelected = !category.isSelected;
        if ($scope.isAccepted) {
            $scope.getPredictionByModel();
        }
    }

    $scope.showPredictionQuartals = true;
    $scope.acceptedChosen = function() {
        $scope.showPredictionQuartals = !$scope.isAccepted;
        if ($scope.isAccepted) {
            $scope.getPredictionByModel();
        }
        fillQuartals();
    }

    function fillQuartals() {
        $scope.q1 = $scope.isAccepted ? $scope.prediction[$scope.currentYear][0] : 0;
        $scope.q2 = $scope.isAccepted ? $scope.prediction[$scope.currentYear][1] : 0;
        $scope.q3 = $scope.isAccepted ? $scope.prediction[$scope.currentYear][2] : 0;
        $scope.q4 = $scope.isAccepted ? $scope.prediction[$scope.currentYear][3] : 0;
    }


    $scope.isAccepted = false;
    $scope.isAuto = false;

    $scope.addPeopleManage = function(){
        $scope.isAnySelected = false;
        angular.forEach($scope.subCategories, function (subCat) {
            if (subCat.isSelected) {
                $scope.isAnySelected = true;
            }
        });
        if(q1 && q2 && q3 && q4 && $scope.isAnySelected) {
            var year = new Date().getFullYear();
            var peopleData = null;
            var q1 = [];
            var q2 = [];
            var q3 = [];
            var q4 = [];
            angular.forEach($scope.subCategories, function (subCat) {
                if (subCat.isSelected) {
                    q1.push({tota: q1});
                    q2.push({subCat: q2});
                    q3.push({subCat: q3});
                    q4.push({subCat: q4});
                }
            });
            peopleData.year = year;
            peopleData.totalyear = q1 + q2 + q3 + q4;
            peopleData.data = {
                q1: q1,
                q2: q2,
                q3: q3,
                q4: q4
            };
            peopleData.accepted = $scope.isAccepted;
            peopleData.auto = $scope.isAuto;
            peopleData.madeby = "Ivanov";

            trendService.addPeopleManage(peopleData).then(function () {

            }, function (error) {
                console.log(error)
            });
        } else {
            $scope.addError = true;
            setTimeout(function (){
                $scope.addError = false;
                tryDigest();
            }, 1000)
        }
    }

    function tryDigest() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }
});