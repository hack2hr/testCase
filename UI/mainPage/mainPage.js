'use strict';

var mainPage = angular.module('myApp.mainPage', ['ngRoute']);

mainPage.controller('MainPageCtrl', function ($scope, mainService, trendService, $rootScope) {

    /* * * * * * * * * * * * * define globals * * * * * * * * */

    var localUser = localStorage.getItem("user"); //todo в будущем не будет пользователя будет куки и токен
    if(localUser){
        $rootScope.user = JSON.parse(localUser);
        $scope.user = $rootScope.user;
    }
    var dynamicColors = function() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    };

    var months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    var barChart = null;
    var years = [];


    $scope.isLoadingReport =false;
    tryDigest();
    $scope.downloadReport = function(){
        $scope.isLoadingReport =true;
        // trendService.downloadReport().then(function(fileInfo){
        setTimeout(function(){
            $scope.isLoadingReport =false;
            tryDigest();
        },1500)
        var fileName = new Date().toDateString()+"report.xlsx";
        if (fileName) {
            var url = ipAdress + "/api/people/download/";
            var save = document.createElement('a');
            save.href = url;
            save.download = fileName;
            var event = document.createEvent("MouseEvents");
            event.initMouseEvent(
                "click", false, true, window, 0, 0, 0, 0, 0
                , false, false, false, false, 0, null
            );
            save.dispatchEvent(event);
        } else {
            console.error("File cant download");
        }

        //})
    }

    /* * * * * * * * * * * * * define scope * * * * * * * * * */

    $scope.categorySelect = null;
    $scope.activeTab = null;

    $scope.categories = [{
        id: 'people',
        title: "Численность трудовых ресурсов",
        subCategories: {
            workAble: { name: 'Трудоспособное население в трудоспособном возрасте', years: {} },
            migrants: { name: 'Иностранные трудовые мигранты', years: {} },
            'other.old': { name: 'Лица старше трудоспособного возраста', years: {} },
            'other.young': { name: 'Подростки', years: {} }
        }
    }];

    // {
    //     id: 'production',
    //     title: "Среднегодовая численность занятых в экономике",
    //     subCategories: {
    //         a: { name: 'А – Сельское, лесное хозяйство, охота, рыболовство и рыбоводство', years: {} },
    //         b: { name: 'В – Добыча полезных ископаемых', years: {} },
    //         c: { name: 'С – Обрабатывающие производства', years: {} },
    //         d: { name: 'D – Обеспечение электрическое энергией, газом и паром, кондиционирование воздуха', years: {} }
    //     }
    // }



    $scope.userCategories = [{

    },{

    },{

    },{

    }];


    $scope.isLoading = true;

    $scope.categorySelected = function(category){
        categorySelected(category);
    }

    $scope.drawChart = function(subCategory){
        drawChart(subCategory);
    }

    $scope.redirectToManage = function(selectedSubName, category){
        $rootScope.category = category;
        $rootScope.category.id = selectedSubName;
        $rootScope.subCategories = JSON.parse(JSON.stringify($scope.categorySelect.subCategories));
        delete $rootScope.subCategories[selectedSubName];
    }

    /* * * * * * * * * * * * call onload * * * * * * * * * * * * * */

    // getTestRequest();
    $scope.years = [];
    setYears();

    getTrends()
        .then(setTrends)
        .then(function() {
            categorySelected($scope.categories[0]);
            drawChart($scope.categorySelect.subCategories.workAble);
            $scope.categorySelect.subCategories.workAble.isChecked = true;
            tryDigest();
            $scope.isLoading = false;
        });

    function tryDigest() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    /* * * * * * * * * * * * * chart * * * * * * * * * * * * * * */

    function setDataByLabels(labels){
        var data = [];
        angular.forEach(labels, function (label){
            data.push(((Math.random() * 10)+1).toFixed(2))
        })
        return data;
    }

    function setDataSet(subCategory){
        var dataset = [];
        var data = {
            type: 'line',
            fill: false,
            backdropColor: dynamicColors(),
            label: subCategory.name,
            data: Object.values(subCategory.years).map(function(value) {
                return Number(value).toFixed(2);
            })
        };
        dataset.push(data);
        return dataset;
    }

    function colorsSet(labels){
        var colors = [];
        angular.forEach(labels, function (label){
            colors.push(dynamicColors())
        })
        return colors;
    }

    function setDefaultDataSetPrograssBar(progressLabels){
        var data = [] ;
        angular.forEach(progressLabels, function (label){
            data.push({label: label, backgroundColor: dynamicColors(), data: ((Math.random() * 10)+2).toFixed(2) });
        })
        return data;
    }

    function drawChart(subCategory){
        if(barChart!=null) barChart.destroy();
        var chartData = {
            labels: $scope.years,
            datasets: setDataSet(subCategory)
        };

        var ctx = document.getElementById('canvas').getContext('2d');
        barChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                title: {
                    position:'left',
                    display: true,
                    text: 'Ресурсы'
                },
                //tooltips: {
                //    mode: 'index',
                //    intersect: true
                //}
            }
        });
    }

    var progressLabels = ['Неутверждено категорий', 'Утверждено категорий', 'Незаполненных категорий']
    drawHor();
    function drawHor(){
        var horizontalBarData = {
            labels: "1",
            datasets: setDefaultDataSetPrograssBar(progressLabels)
        };
        var ctx = document.getElementById('canvasVert').getContext('2d');
        var myHorizontalBar = new Chart(ctx, {
            type: 'horizontalBar',
            data: horizontalBarData,
            options: {
                // Elements options apply to all of the options unless overridden in a dataset
                // In this case, we are setting the border of each horizontal bar to be 2px wide
                elements: {
                    rectangle: {
                        borderWidth: 2,
                    }
                },
                indexAxis: 'y',
                responsive: true,
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Прогресс по категориям'
                }
            }
        });
    }

    var categoryPercent = ['Сельское хозяйство', 'Полезные ископаемые', 'Строительство']
    drawCategoryProgress();
    function drawCategoryProgress(){
        var pieData = {
            labels:categoryPercent,
            datasets: [{label:"Data", data:setDataByLabels(categoryPercent),backgroundColor:colorsSet(categoryPercent)}]
        };
        var ctx = document.getElementById('canvasPercents').getContext('2d');
        var myHorizontalBar = new Chart(ctx, {
            type: 'doughnut',
            data: pieData,
            options: {
                // Elements options apply to all of the options unless overridden in a dataset
                // In this case, we are setting the border of each horizontal bar to be 2px wide
                elements: {
                    rectangle: {
                        borderWidth: 2,
                    }
                },
                responsive: true,
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Доля по категориям'
                }
            }
        });
    }

    /* * * * * * * * * * * * trends calculation * * * * * * * * * */
    function getTrends() {
        return Promise.all(
            $scope.categories.map(function(trend) {
                return trendService[trend.id].getAll();
            })
        );
    }

    function setTrends(uploadedTrends) {
        var QUATER_AMOUNT = 4;

        uploadedTrends.forEach(function(categoryTrend, index) {
            categoryTrend.forEach(function(trend) {
                var params = JSON.parse(JSON.stringify($scope.categories[index].subCategories));
                Object.keys(params).forEach(function(param) {
                    var total = Object.keys(trend.data).reduce(function(sum, quater) {
                        return sum + parseParam(param.split('.'), trend.data[quater]);
                    }, 0);

                    $scope.categories[index].subCategories[param].years[trend.year] = total / QUATER_AMOUNT;
                });
            });
        });

        return Promise.resolve();
    }


    /* * * * * * * * * * * * * helpers * * * * * * * * * * * * * */

    function setYears(){
        var currentYear = new Date().getFullYear();
        var beforeDate = currentYear;
        var afterDate = currentYear;
        $scope.years.push(afterDate);
        years.push(afterDate);
        for(var i=0; i < 6; i++){
            beforeDate--;
            afterDate++;
            $scope.years.push(afterDate);
            $scope.years.unshift(beforeDate);
            years.push(afterDate);
            years.unshift(beforeDate);
        }
    }

    function categorySelected(category){
        $scope.categorySelect = category;
        $scope.activeTab = category.id;
    }

    function parseParam(path, data) {
        if (path.length == 1) {
            return parseFloat(data[path[0]]);
        }
        return parseParam(path.slice(1), data[path[0]])
    }



});