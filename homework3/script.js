const makingTasker = (function(){
    const config = {
        appData: 'appData',
        initData: [],
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
        }
    };

    const controller = {
        addTask: function(id, name, newTag, insertBeforeEl, closeTag, editTag, type){
            that = this
            let newSticker = $(newTag).insertBefore(insertBeforeEl);
            
            newSticker.find(closeTag).click(function(){
                that.delete(that, $(this).parent().attr('data-id'));
            });

            newSticker.find(editTag).click(function(){
                console.log($(that));
                that.edit(that, $(this).parent().attr('data-id'));
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
            alert(document.getElementById('bodyTemplate').innerHTML);
            tmpl = _.template(document.getElementById('bodyTemplate').innerHTML);
            let html = tmpl({localStorageData: logs.selectDataLocalStorage()});
            document.getElementsByTagName('body')[0].innerHTML = html;
        },
    };

    const handler = {
        on: function(){
            that = this;
            let currentTask = null;
            let currentTaskHtml = null;

            $('#addTaskQueue').click(function(){
                let id = Math.floor(Math.random() * 100);
                let name = prompt('What will be the name of task', 'default task');
                controller.addTask(id, name,`<div class="content__stickerQueue" data-id="${id}">
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

                    controller.addTask(currentTask.id, currentTask.name,`<div class="content__stickerInWork" data-id="${id}">
                        <div class="content__name">${currentTask.name}</div>
                        <i class="fa fa-times content__close--inwork" aria-hidden="true"></i>
                        <i class="fa fa-pencil content__edit--inwork" aria-hidden="true"></i>
                    </div>`, '#addTaskInWork', '.content__close--inwork', '.content__edit--inwork', 'inwork');
                }
            });

            $('.content__edit--queue').click(function(event){
                controller.edit(this, $(this).parent().attr('data-id'));
            });

            $('.content__close--queue').click(function(event){
                controller.delete(this, $(this).parent().attr('data-id'));
            });

            $('#addTaskInWork').click(function(){

            });
            $('#addTaskComplited').click(function(){alert('complited')});
        },
        off: function(){},

        // edit: function(that, id){
        //     alert(id);
        //     let anotherNameTask = prompt('Another name of task', 'another task');
        //     let tmpLocalStorage = logs.selectDataLocalStorage();
        //     let tmpTask = _.remove(tmpLocalStorage, {id: +id})[0];
        //     tmpTask['name'] = anotherNameTask;
        //     tmpLocalStorage.push(tmpTask);

        //     logs.insertDataLocalStorage(tmpLocalStorage);
        // },

        // delete: function(that, id){
        //     alert(id);
        //     let tmpLocalStorage = logs.selectDataLocalStorage();
        //     _.remove(tmpLocalStorage, {id: +id});
        //     logs.insertDataLocalStorage(tmpLocalStorage);
        //     $(that).parent().remove();
        // }
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

