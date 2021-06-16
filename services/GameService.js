mainLoopService = require("./MainLoopService")

module.exports = {
    getGameState : function(gameID, forPlayer){

        let totalState = mainLoopService.getGameState(gameID)

        if (totalState.error !== undefined){
            return totalState.error
        }

        if(forPlayer !== totalState.players[0].playerID){
            totalState.players[0].hand = null
        }

        if(forPlayer !== totalState.players[1].playerID){
            totalState.players[1].hand = null
        }


        return totalState
    }
}

