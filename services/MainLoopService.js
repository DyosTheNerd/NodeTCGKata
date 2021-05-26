deckService = require("./DeckService")

let currentGames = {}


module.exports = {
    newGame : function (players){
        currentGames["gameID"] = {}
        currentGames["gameID"].players = players
        players.forEach(pl =>{
            deckService.initializeBasicDeckForPlayerAndGame("gameID",pl)
        })
        return "gameID"
    },
    endTurn: function(currentPlayer, gameID){
        return "playerB"
    },
    getCurrentPlayerMaxMana: function(gameID){
        return 1
    },
    getCurrentPlayerRemainingMana : function(gameID){
        return 1
    },
    getPlayerCardsInHand : function(gameID, player){
        let requestedPlayer = player === undefined? this.getCurrentPlayer(gameID): player

        if(requestedPlayer == "playerA"){
            return [{cost:0},{cost:0},{cost:0},{cost:0}]
        }

        return [{cost:0},{cost:0},{cost:0}]
    },
    getCurrentPlayer : function (gameID){
        return "playerA"
    }


}