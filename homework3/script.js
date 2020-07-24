let makingTasker = (function(){
    let config = {
        appData: 'appData',
        initData: [],
    };

    let logs = {
        init: function(){
            if(!localStorage.getItem(config.appData)){
                localStorage.setItem(config.appData, JSON.stringify(config.initData));
            }

            let localStorageData = this.selectDataLocalStorage();
            let htmlCodeQueue = '';
            let localStorageDataQueue = _.filter(localStorageData, {type: 'queue'});
            _.each(localStorageDataQueue, function(item){
                htmlCodeQueue += `<div class="content__stickerQueue" data-id="${item.id}">
                    <div class="content__name">${item.name}</div>
                    <i class="fa fa-times content__close--queue" aria-hidden="true"></i>
                    <i class="fa fa-pencil content__edit--queue" aria-hidden="true"></i>
                </div>`;
            });

            $(htmlCodeQueue).insertBefore('#addTaskQueue');
        },

        selectDataLocalStorage: function(){
            return JSON.parse(localStorage.getItem(config.appData));
        },

        insertDataLocalStorage: function(localStorageData){
            localStorage.setItem(config.appData, JSON.stringify(localStorageData));
        },

        addTask: function(id, name, newTag, insertBeforeEl, closeTag, editTag, type){
            let that = this;
            
            let newSticker = $(newTag).insertBefore(insertBeforeEl);
            
            newSticker.find(closeTag).click(function(){
                handler.delete(that, $(this).parent().attr('data-id'));
            });

            newSticker.find(editTag).click(function(){
                console.log($(that));
                handler.edit(that, $(this).parent().attr('data-id'));
            });
            
            let tmpArrLocalStorage = that.selectDataLocalStorage();
            tmpArrLocalStorage.push({id: id, name:name, date:new Date(), type:type});
            that.insertDataLocalStorage(tmpArrLocalStorage); 
        },
    };

    let handler = {
        on: function(){
            that = this;
            let currentTask = null;
            let currentTaskHtml = null;
            $('#addTaskQueue').click(function(){
                let id = Math.floor(Math.random() * 100);
                let name = prompt('What will be the name of task', 'default task');
                logs.addTask(id, name,`<div class="content__stickerQueue" data-id="${id}">
                <div class="content__name">${name}</div>
                <i class="fa fa-times content__close--queue" aria-hidden="true"></i>
                <i class="fa fa-pencil content__edit--queue" aria-hidden="true"></i>
            </div>`, '#addTaskQueue', '.content__close--queue', '.content__edit--queue', 'queue');
            });

            $('.content__stickerQueue').draggable({
                start: function(){
                    let id = +$(this).attr('data-id');
                    currentTask = _.find(logs.selectDataLocalStorage(), {id: id});
                    currentTaskHtml = this;
                }
            });

            $("#contentInWork").droppable({
                drop: function (){
                    $(currentTaskHtml).animate({
                        opacity: 0.5
                    }, 1000).remove();

                    let dataLocalStorage = logs.selectDataLocalStorage();
                    _.remove(dataLocalStorage, {id: currentTask.id});
                    logs.insertDataLocalStorage(dataLocalStorage);

                    let id = Math.floor(Math.random() * 100);

                    logs.addTask(currentTask.id, currentTask.name,`<div class="content__stickerInWork" data-id="${id}">
                        <div class="content__name">${currentTask.name}</div>
                        <i class="fa fa-times content__close--inwork" aria-hidden="true"></i>
                        <i class="fa fa-pencil content__edit--inwork" aria-hidden="true"></i>
                    </div>`, '#addTaskInWork', '.content__close--inwork', '.content__edit--inwork', 'inwork');
                }
            });

            $('.content__edit--queue').click(function(event){
                that.edit(this, $(this).parent().attr('data-id'));
            });

            $('.content__close--queue').click(function(event){
                that.delete(this, $(this).parent().attr('data-id'));
            });

            $('#addTaskInWork').click(function(){

            });
            $('#addTaskComplited').click(function(){alert('complited')});
        },
        off: function(){},

        edit: function(that, id){
            alert(id);
            let anotherNameTask = prompt('Another name of task', 'another task');
            let tmpLocalStorage = logs.selectDataLocalStorage();
            let tmpTask = _.remove(tmpLocalStorage, {id: +id})[0];
            tmpTask['name'] = anotherNameTask;
            tmpLocalStorage.push(tmpTask);

            logs.insertDataLocalStorage(tmpLocalStorage);
        },

        delete: function(that, id){
            alert(id);
            let tmpLocalStorage = logs.selectDataLocalStorage();
            _.remove(tmpLocalStorage, {id: +id});
            logs.insertDataLocalStorage(tmpLocalStorage);
            $(that).parent().remove();
        }
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

