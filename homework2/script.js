$(document).ready(function(){
    //let date = new Date();

    let logger = {
        totalSeconds: 0,
        idTotalInterval: null,
        idActiveInterval : null,
        stopTime : 0,
        secondsWithoutCalculate : 0,

        init: function(){
            this.stopTime = 0;
            this.totalSeconds = 0;
            this.stopCountSeconds();
            this.stopActiveSeconds();
            this.startCountSeconds();
            if(localStorage.length === 0){
                localStorage.setItem('logs', JSON.stringify([]));
            }
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

        startCountSeconds: function(){
            that = this;
            that.idSetInterval = setInterval(() => { that.setTotalSeconds(1) }, 1000);
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

        setPeriodWithoutCalculate: function(time){
            this.secondsWithoutCalculate += time;
        },

        getPeriodWithoutCalculate: function(){
            return this.secondsWithoutCalculate;
        },

        setStopSeconds: function(time){
            this.stopTime += time;
        },

        getStopSeconds: function(time){
            return this.stopTime;
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
        if(logger.idActiveInterval){
            clearInterval(logger.idActiveInterval);
        }
        
        if(logger.getPeriodWithoutCalculate() >= 20){
            logger.secondsWithoutCalculate = 0;
            if(logger.stopTime >= 20)
                logger.stopTime -= 20;
        }

        logger.idActiveInterval = setInterval(() => {logger.stopTime += 1, logger.secondsWithoutCalculate += 1}, 1000);
    });

    $(window).blur(function(event){
        logger.stopCountSeconds();
        logger.stopActiveSeconds();
        logger.writeRecord();
    });

    $(window).focus(function(){
        logger.init();
    });
});