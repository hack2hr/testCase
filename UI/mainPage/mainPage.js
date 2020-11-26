'use strict';

var mainPage = angular.module('myApp.mainPage', ['ngRoute']);

mainPage.controller('MainPageCtrl', function ($scope, mainService,  $rootScope) {

    var boards = [
        {
            id: "_problem", title: "Проблема", class: "text-light,pointer,bg-secondary", dragTo: ["_working"], item: [{id: "_test_delete", title: "Try drag this (Look the console)"},{title: "Try Click This!", click: function(el) {alert("click")}, class: ["peppe", "bello"]}]
        },
        {
            id: "_idea", title: "Идея проекта", class: "text-light,pointer,bg-info", dragTo: ["_working"], item: [{id: "_test_delete", title: "Try drag this (Look the console)"},{title: "Try Click This!", click: function(el) {alert("click")}, class: ["peppe", "bello"]}]
        },
        {
            id: "_idea", title: "HADI", class: "text-light,pointer,bg-dark", dragTo: ["_working"], item: [{id: "_test_delete", title: "Try drag this (Look the console)"},{title: "Try Click This!", click: function(el) {alert("click")}, class: ["peppe", "bello"]}]
        },
        {
            id: "_working", title: "Разработка", class: "text-light,pointer,bg-warning", item: [{title: "Do Something!"}, {title: "Run?"}]
        },
        {
            id: "_in_review", title: "Внедрение", class: "text-light,pointer,bg-danger", item: [{title: "Do Something!"}, {title: "Run?"}]
        },
        {
            id: "_done", title: "Внедрено", class: "text-light,pointer,bg-success", dragTo: ["_working"], item: [{title: "All right"}, {title: "Ok!"}]
        }
    ];

    var KanbanTest = new jKanban({
        element: "#myKanban",
        gutter: "10px",
        widthBoard: "450px",
        itemHandleOptions:{
            enabled: true,
        },
        click: function(el) {
            console.log("Trigger on all items click!");
        },
        dropEl: function(el, target, source, sibling){
            console.log(target.parentElement.getAttribute('data-id'));
            console.log(el, target, source, sibling)
        },
        buttonClick: function(el, boardId) {
            console.log(el);
            console.log(boardId);
            // create a form to enter element
            var formItem = document.createElement("form");
            formItem.setAttribute("class", "itemform");
            formItem.innerHTML =
                '<div class="form-group">' +
                '<textarea class="form-control" rows="2" autofocus></textarea>' +
                '</div><div class="form-group">' +
                '<button type="submit" class="btn btn-primary btn-xs pull-right">Сохранить</button>' +
                '<button type="button" id="CancelBtn" class="btn btn-default btn-xs pull-right">Отмена</button></div>';

            KanbanTest.addForm(boardId, formItem);
            formItem.addEventListener("submit", function(e) {
                e.preventDefault();
                var text = e.target[0].value;
                KanbanTest.addElement(boardId, {
                    title: text
                });
                formItem.parentNode.removeChild(formItem);
            });
            document.getElementById("CancelBtn").onclick = function() {
                formItem.parentNode.removeChild(formItem);
            };
        },
        addItemButton: true,
        boards:  boards
    });

    var toDoButton = document.getElementById("addToDo");
    toDoButton.addEventListener("click", function() {
        KanbanTest.addElement("_todo", {
            title: "Test Add"
        });
    });

    var addBoardDefault = document.getElementById("addDefault");
    addBoardDefault.addEventListener("click", function() {
        KanbanTest.addBoards([
            {
                id: "_default",
                title: "Kanban Default",
                item: [
                    {
                        title: "Default Item"
                    },
                    {
                        title: "Default Item 2"
                    },
                    {
                        title: "Default Item 3"
                    }
                ]
            }
        ]);
    });

    var removeBoard = document.getElementById("removeBoard");
    removeBoard.addEventListener("click", function() {
        KanbanTest.removeBoard("_done");
    });

    var removeElement = document.getElementById("removeElement");
    removeElement.addEventListener("click", function() {
        KanbanTest.removeElement("_test_delete");
    });

    var allEle = KanbanTest.getBoardElements("_todo");
    allEle.forEach(function(item, index) {
        //console.log(item);
    });
});