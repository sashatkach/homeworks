const logger = (function(){
    let handlers = {
        onMouseMoveWindow: function(){
            $(window).mousemove(function(event){
                if(logs.idActiveInterval){
                    clearInterval(logs.idActiveInterval);
                }
        
                if(logs.getSecondsWithoutCalculate() >= 20){
                    logs.resetSecondsWithoutCalculate();
                    if(logs.getStopTime() >= 20)
                        logs.addStopTime(-20);
                }
        
                logs.idActiveInterval = setInterval(() => {logs.addStopSeconds(1), logs.addSecondsWithoutCalculate(1)}, 1000);
            });
        },

        onCloseWindow : function(){
            $(window).blur(function(event){
                logs.leaveControlPage();
            });
        },
    
        onLeaveWindow: function(){
            $(window).on('unload', function(event){
                logs.leaveControlPage();
            });
        },
    
        onFocusWindow: function(){
            $(window).focus(function(){
                logs.reset();
            });
        }
    };

    let logs = {
        totalSeconds: 0,
        idTotalInterval: null,
        idActiveInterval : null,
        stopTime : 0,
        secondsWithoutCalculate : 0,

        preInit: function(){
            this.stopTime = 0;
            this.totalSeconds = 0;
            this.resetSecondsWithoutCalculate();
            this.stopCountSeconds();
            this.stopActiveSeconds();
            this.startCountSeconds();
        },

        init: function(){
            this.preInit();
            handlers.onMouseMoveWindow();
            handlers.onFocusWindow();
            handlers.onLeaveWindow();
            handlers.onCloseWindow();

            if(!localStorage.getItem(this.config.localStorageName)){
                localStorage.setItem(this.config.localStorageName, JSON.stringify([]));
            }
        },

        reset: function(){
            this.preInit();
        },

        selectData: function(){
            return JSON.parse(localStorage.getItem(this.config.localStorageName));
        },

        insertData: function(){
            let valWithLocalStorageData = this.selectData();
            valWithLocalStorageData.push({
                pageUrl: location.href,
                time: {
                    totalTime: this.getTotalSeconds(),
                    activeTime: this.getActiveTime()
                }
            })
            localStorage.setItem(this.config.localStorageName, JSON.stringify(valWithLocalStorageData));
        },

        leaveControlPage: function(){
            this.stopCountSeconds();
            this.stopActiveSeconds();
            this.insertData();
        },

        startCountSeconds: function(){
            that = this;
            that.idTotalInterval = setInterval(() => { that.addTotalSeconds(1) }, 1000);
        },

        stopCountSeconds: function(){
            clearInterval(this.idTotalInterval);
        },

        stopActiveSeconds: function(){
            clearInterval(this.idActiveInterval);
        },

        getActiveTime: function(){
            return this.totalSeconds - this.stopTime;
        },

        addSecondsWithoutCalculate: function(time){
            this.secondsWithoutCalculate += time;
        },

        getSecondsWithoutCalculate: function(){
            return this.secondsWithoutCalculate;
        },

        resetSecondsWithoutCalculate: function(){
            this.secondsWithoutCalculate = 0;
        },

        addStopSeconds: function(time){
            this.stopTime += time;
        },

        getStopSeconds: function(time){
            return this.stopTime;
        },

        addTotalSeconds: function(time){
            this.totalSeconds += time;
        },
        
        getTotalSeconds: function(){
            return this.totalSeconds;
        }
    };

    return {
        init: logs.init();
    };
})();

$(document).ready(function(){
    logger.init();  
});