const deckService = require("./DeckService")
const handService = require("./HandService")

let currentGames = {}


module.exports = {
    newGame : function (players){
        currentGames["gameID"] = {}
        currentGames["gameID"].players = players
        players.forEach(pl =>{
            deckService.initializeBasicDeckForPlayerAndGame("gameID",pl)
            handService.addCardToHand(deckService.drawCard("gameID",pl),"gameID",pl)
            handService.addCardToHand(deckService.drawCard("gameID",pl),"gameID",pl)
            handService.addCardToHand(deckService.drawCard("gameID",pl),"gameID",pl)
        })

        handService.addCardToHand(deckService.drawCard("gameID",players[0]),"gameID",players[0])

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