const makingTasker = (function(){
    const config = {
        appData: 'appData',
        initData: [],
    };

    const taskObject = {
        currentTask : null,
        currentTaskHtml : null,
    };

    const logs = {
        init: function(){
            if(!localStorage.getItem(config.appData)){
                localStorage.setItem(config.appData, JSON.stringify(config.initData));
            }

            /*let localStorageData = this.selectDataLocalStorage();
            let htmlCodeQueue = '';
            let localStorageDataQueue = _.filter(localStorageData, {type: 'queue'});
            _.each(localStorageDataQueue, function(item){
                htmlCodeQueue += `<div class="content__stickerQueue" data-id="${item.id}">
                    <div class="content__name">${item.name}</div>
                    <i class="fa fa-times content__close--queue" aria-hidden="true"></i>
                    <i class="fa fa-pencil content__edit--queue" aria-hidden="true"></i>
                </div>`;
            });

            $(htmlCodeQueue).insertBefore('#addTaskQueue');*/
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
            if(taskObject.currentTask.type !== type){
                $(taskObject.currentTaskHtml).animate({
                    opacity: 0.5
                }, 1000).remove();

                let dataLocalStorage = logs.selectDataLocalStorage();
                _.remove(dataLocalStorage, {id: taskObject.currentTask.id});
                logs.insertDataLocalStorage(dataLocalStorage);

                let id = Math.floor(Math.random() * 100);
                
                let stickerClass = null;
                let stickerBtnId = null;
                switch(type){
                    case 'queue': stickerClass = "content__stickerQueue"; stickerBtnId = "#addTaskQueue"; break;
                    case 'inwork': stickerClass = "content__stickerInWork"; stickerBtnId = "#addTaskInWork"; break;
                    case 'complited': stickerClass = "content__stickerComplited"; stickerBtnId = "#addTaskComplited"; break;
                }
                

                controller.add(id, taskObject.currentTask.name,`<div class="${stickerClass}" data-id="${id}">
                    <div class="content__name">${taskObject.currentTask.name}</div>
                    <i class="fa fa-times content__close" aria-hidden="true"></i>
                    <i class="fa fa-pencil content__edit" aria-hidden="true"></i>
                </div>`, stickerBtnId, '.content__close', '.content__edit', type);
                controller.render();
            }
        }
    };

    const controller = {
        add: function(id, name, newTag, insertBeforeEl, closeTag, editTag, type){
            that = this
            let newSticker = $(newTag).insertBefore(insertBeforeEl);
            
            newSticker.find(closeTag).click(function(){
                that.delete(that, $(this).parent().attr('data-id'));
            });

            newSticker.find(editTag).click(function(){
                console.log($(that));
                that.edit(that, $(this).parent().attr('data-id'));
            });

            newSticker.draggable({
                start: function(){
                    [taskObject.currentTask, taskObject.currentTaskHtml] = managerDraggable.startDraggable(this);
                }
            });
            
            let tmpArrLocalStorage = logs.selectDataLocalStorage();
            tmpArrLocalStorage.push({id: id, name:name, date:new Date(), type:type});
            logs.insertDataLocalStorage(tmpArrLocalStorage);
            this.render(); 
        },

        edit: function(that, id){
            alert(id);
            let anotherNameTask = prompt('Another name of task', 'another task');
            let tmpLocalStorage = logs.selectDataLocalStorage();
            let tmpTask = _.remove(tmpLocalStorage, {id: +id})[0];
            tmpTask['name'] = anotherNameTask;
            tmpLocalStorage.push(tmpTask);

            logs.insertDataLocalStorage(tmpLocalStorage);
            this.render();
        },

        delete: function(that, id){
            alert(id);
            let tmpLocalStorage = logs.selectDataLocalStorage();
            _.remove(tmpLocalStorage, {id: +id});
            logs.insertDataLocalStorage(tmpLocalStorage);
            $(that).parent().remove();
            this.render();
        },

        //не уверен, что рендер должен относиться к контроллеру
        render: function(){
            tmpl = _.template(document.getElementById('bodyTemplate').innerHTML);
            let html = tmpl({localStorageData: logs.selectDataLocalStorage()});
            document.getElementsByTagName('body')[0].innerHTML = html;
        },
    };

    const handler = {
        on: function(){
            that = this;


            function beforeCreateSticker(btnId, classTask, type){
                let id = Math.floor(Math.random() * 100);
                let name = prompt('What will be the name of task', 'default task');
                controller.add(id, name,`<div class="${classTask}" data-id="${id}">
                <div class="content__name">${name}</div>
                <i class="fa fa-times content__close" aria-hidden="true"></i>
                <i class="fa fa-pencil content__edit" aria-hidden="true"></i>
            </div>`, btnId, '.content__close', '.content__edit', type);
            }

            $('#addTaskQueue').click(function(){
                beforeCreateSticker('#addTaskQueue', 'content__stickerQueue', 'queue');
            });

            $('#addTaskInWork').click(function(){
                beforeCreateSticker('#addTaskInWork', 'content__stickerInWork', 'inwork');
            });

            $('#addTaskComplited').click(function(){
                beforeCreateSticker('#addTaskComplited', 'content__stickerComplited', 'complited');
            });

            $('.content__stickerQueue').draggable({
                start: function(){
                    [taskObject.currentTask, taskObject.currentTaskHtml] = managerDraggable.startDraggable(this);
                }
            });

            $('.content__stickerInWork').draggable({
                start: function(){
                    [taskObject.currentTask, taskObject.currentTaskHtml] = managerDraggable.startDraggable(this);
                }
            });

            $('.content__stickerComplited').draggable({
                start: function(){
                    [taskObject.currentTask, taskObject.currentTaskHtml] = managerDraggable.startDraggable(this);
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
            });

            $('.content__close').click(function(event){
                controller.delete(this, $(this).parent().attr('data-id'));
                controller.render();
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

