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
                    <div class="content__name">${name}</div>
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

        addTask: function(id, newTag, insertBeforeEl, closeTag, editTag){
            let that = this;
            
            let newSticker = $(newTag).insertBefore(insertBeforeEl);
            
            newSticker.find(closeTag).click(function(){
                handler.delete(that);
            });

            newSticker.find(editTag).click(function(){
                handler.edit(that);
            });
            
            let tmpArrLocalStorage = that.selectDataLocalStorage();
            tmpArrLocalStorage.push({id: id, name:name, date:new Date(), type:"queue"});
            that.insertDataLocalStorage(tmpArrLocalStorage); 
        },
    };

    let handler = {
        on: function(){
            that = this;
            $('#addTaskQueue').click(function(){
                let id = Math.floor(Math.random() * 100);
                let name = prompt('What will be the name of task', 'default task');
                logs.addTask(id, `<div class="content__stickerQueue" data-id="${id}">
                <div class="content__name">${name}</div>
                <i class="fa fa-times content__close--queue" aria-hidden="true"></i>
                <i class="fa fa-pencil content__edit--queue" aria-hidden="true"></i>
            </div>`, '#addTaskQueue', '.content__close--queue', '.content__edit--queue');
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
            alert('edit');
            let anotherNameTask = prompt('Another name of task', 'another task');
            let tmpLocalStorage = logs.selectDataLocalStorage();
            let tmpTask = _.remove(tmpLocalStorage, {id: id})[0];
            tmpTask['name'] = anotherNameTask;
            tmpLocalStorage.push(tmpTask);
            logs.insertDataLocalStorage(tmpLocalStorage);
        },

        delete: function(that, id){
            alert('delete');
            let tmpLocalStorage = logs.selectDataLocalStorage();
            let tmpTask = _.remove(tmpLocalStorage, {id: id});
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

