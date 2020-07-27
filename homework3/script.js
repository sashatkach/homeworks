const makingTasker = (function(){
    const config = {
        appData: 'appData',
        initData: [],
    };

    const taskObjectManager = {
        currentTask : null,
        currentTaskHtml : null,

        makeTask: function(htmlTaskAttr){
            let id = logs.selectDataLocalStorage().length;
            let name = prompt('What will be the name of task', 'default task');
            return {
                id: id,
                name: name
            };
        }
    };

    const logs = {
        init: function(){
            if(!localStorage.getItem(config.appData)){
                localStorage.setItem(config.appData, JSON.stringify(config.initData));
            }
            controller.render();
        },

        selectDataLocalStorage: function(){
            return JSON.parse(localStorage.getItem(config.appData));
        },

        insertDataLocalStorage: function(localStorageData){
            localStorage.setItem(config.appData, JSON.stringify(localStorageData));
        },
    };

    const managerDraggable = {
        startDraggable: function(that){
            let id = +$(that).attr('data-id');
            currentTask = _.find(logs.selectDataLocalStorage(), {id: id});
            currentTaskHtml = that;
            return [currentTask, currentTaskHtml];
        },

        stopDraggable: function(type){
            if(taskObjectManager.currentTask.type !== type){
                $(taskObjectManager.currentTaskHtml).animate({
                    opacity: 0.5
                }, 1000).remove();

                let dataLocalStorage = logs.selectDataLocalStorage();
                _.remove(dataLocalStorage, {id: taskObjectManager.currentTask.id});
                logs.insertDataLocalStorage(dataLocalStorage);
                
                let stickerClass = null;
                let stickerBtnId = null;
                switch(type){
                    case 'queue': stickerClass = "content__stickerQueue"; stickerBtnId = "#addTaskQueue"; break;
                    case 'inwork': stickerClass = "content__stickerInWork"; stickerBtnId = "#addTaskInWork"; break;
                    case 'complited': stickerClass = "content__stickerComplited"; stickerBtnId = "#addTaskComplited"; break;
                }
                
                controller.renderNewTask(taskObjectManager.currentTask.id, taskObjectManager.currentTask.name, stickerClass, stickerBtnId);
                controller.add(taskObjectManager.currentTask.id, taskObjectManager.currentTask.name, type);
                controller.render();
                handler.on();
            }
        }
    };

    const controller = {
        add: function(id, name, type){
            let tmpArrLocalStorage = logs.selectDataLocalStorage();
            tmpArrLocalStorage.push({id: id, name:name, date:new Date(), type:type});
            logs.insertDataLocalStorage(tmpArrLocalStorage);
            this.render(); 
            handler.on();
        },

        edit: function(that, id){
            let anotherNameTask = prompt('Another name of task', 'another task');
            let tmpLocalStorage = logs.selectDataLocalStorage();
            let tmpTask = _.remove(tmpLocalStorage, {id: +id})[0];
            tmpTask['name'] = anotherNameTask;
            tmpLocalStorage.push(tmpTask);

            logs.insertDataLocalStorage(tmpLocalStorage);
            this.render();
            handler.on();
        },

        delete: function(that, id){
            let tmpLocalStorage = logs.selectDataLocalStorage();
            _.remove(tmpLocalStorage, {id: +id});
            logs.insertDataLocalStorage(tmpLocalStorage);
            $(that).parent().remove();
            this.render();
            handler.on();
        },
        
        render: function(){
            let tmpl = _.template($('#bodyTemplate').html());
            let html = tmpl({localStorageData: logs.selectDataLocalStorage()});
            if($('#container>.wrapper').is('.wrapper')){
                $('#container>.wrapper').replaceWith(html);
            }else {
                $('#container').append(html);
            }
        },

        renderNewTask: function(id, name, classTask, btnId){
            let tmpl = _.template($('#taskTemplate').html());
            let html = tmpl({id: id, classTask: classTask, name: name});
            $(html).insertBefore(btnId);
        }
    };

    const handler = {
        on: function(){
            that = this;

            $('#addTaskQueue').click(function(){
                let taskHtmlAttr = taskObjectManager.makeTask();
                controller.renderNewTask(taskHtmlAttr.id, taskHtmlAttr.name, '.content__stickerInWork', '#addTaskQueue');
                controller.add(taskHtmlAttr.id, taskHtmlAttr.name, 'queue');
            });

            $('#addTaskInWork').click(function(){
                let taskHtmlAttr = taskObjectManager.makeTask();
                controller.renderNewTask(taskHtmlAttr.id, taskHtmlAttr.name, '.content__stickerInWork', '#addTaskInWork');
                controller.add(taskHtmlAttr.id, taskHtmlAttr.name, 'inwork');
            });

            $('#addTaskComplited').click(function(){
                let taskHtmlAttr = taskObjectManager.makeTask();
                controller.renderNewTask(taskHtmlAttr.id, taskHtmlAttr.name, '.content__stickerComplited', '#addTaskInWork');
                controller.add(taskHtmlAttr.id, taskHtmlAttr.name, 'complited');
            });

            $('.content__stickerQueue').draggable({
                start: function(){
                    [taskObjectManager.currentTask, taskObjectManager.currentTaskHtml] = managerDraggable.startDraggable(this);
                }
            });

            $('.content__stickerInWork').draggable({
                start: function(){
                    [taskObjectManager.currentTask, taskObjectManager.currentTaskHtml] = managerDraggable.startDraggable(this);
                }
            });

            $('.content__stickerComplited').draggable({
                start: function(){
                    [taskObjectManager.currentTask, taskObjectManager.currentTaskHtml] = managerDraggable.startDraggable(this);
                }
            });

            $("#contentQueue").droppable({
                drop: function (){
                    managerDraggable.stopDraggable('queue');
                }
            });

            $("#contentInWork").droppable({
                drop: function (){
                    managerDraggable.stopDraggable('inwork');
                }
            });

            $("#contentComplited").droppable({
                drop: function (){
                    managerDraggable.stopDraggable('complited');
                }
            });

            $('.content__edit').click(function(event){
                controller.edit(this, $(this).parent().attr('data-id'));
                controller.render();
                handler.on();
            });

            $('.content__close').click(function(event){
                controller.delete(this, $(this).parent().attr('data-id'));
                controller.render();
                handler.on();
            });
        },
        off: function(){},
    };

    function init(){
        logs.init();
        handler.on();
    };

    return {
        init: init,
    };
})();

$(document).ready(function(){
    makingTasker.init();
});

