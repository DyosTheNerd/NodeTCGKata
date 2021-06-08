mainLoopService = require("./MainLoopService")

module.exports = {
    getGameState : function(gameID){
        return mainLoopService.getGameState(gameID)
    }
}

