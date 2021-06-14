mainLoopService = require("./MainLoopService")

module.exports = {
    getGameState : function(gameID){
        let totalState = mainLoopService.getGameState(gameID)

        totalState.players[0].hand = null
        totalState.players[1].hand = null

        return totalState
    }
}

