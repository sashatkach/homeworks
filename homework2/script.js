$(document).ready(function(){
    let logger = {
        totalSeconds: 0,
        activeTime: 0,
        idSetInterval: null,

        init: function(){
            this.startCountSeconds();
            if(localStorage.length === 0)localStorage.setItem('logs', JSON.stringify([]));
        },

        loadData: function(){
            return JSON.parse(localStorage.getItem('logs'));
        },


        writeRecord: function(){
            let valWithLocalStorageData = this.loadData();
            valWithLocalStorageData.push({
                pageUrl: location.href,
                time: {
                    totalTime: this.getTotalSeconds(),
                    activeTime: this.getActiveTime()
                }
            })
            localStorage.setItem('logs', JSON.stringify(valWithLocalStorageData));
        },
        /*addSecond: function(that){
            that.totalSeconds += 1;
        },*/
        startCountSeconds: function(){
            that = this;
            that.idSetInterval = setInterval(() => { that.setTotalSeconds(1) }, 1000);
        },

        stopCountSeconds: function(){
            clearInterval(this.idSetInterval);
        },

        setActiveTime: function(time){
            this.activeTime += time;
        },

        getActiveTime: function(){
            return Math.floor(this.activeTime);
        },

        setTotalSeconds: function(time){
            this.totalSeconds += time;
        },
        
        getTotalSeconds: function(){
            return this.totalSeconds;
        },
    }

    logger.init();
    
    $(window).mousemove(function(event){
        console.log(logger.totalSeconds);
        //console.log(event);
        logger.setActiveTime(event.timeStamp);
    });

    $(window).blur(function(event){
        logger.stopCountSeconds();
        logger.writeRecord();
    });

    $(window).focus(function(){
        logger.init();
    });
});