const deckService = require("./DeckService")
const handService = require("./HandService")

let currentGames = {}


module.exports = {
    newGame : function (players){
        currentGames["gameID"] = {}
        currentGames["gameID"].players = players
        currentGames["gameID"].currentPlayer = players[0]
        players.forEach(pl =>{
            deckService.initializeBasicDeckForPlayerAndGame("gameID",pl)
            handService.initializeHand("gameID",pl)
            handService.addCardToHand("gameID",pl,deckService.drawCard("gameID",pl))
            handService.addCardToHand("gameID",pl,deckService.drawCard("gameID",pl))
            handService.addCardToHand("gameID",pl,deckService.drawCard("gameID",pl))
        })

        handService.addCardToHand("gameID",players[0],deckService.drawCard("gameID",players[0]))
        let otherPlayer = players[1]
        currentGames["gameID"].maxMana = {}
        currentGames["gameID"].maxMana[currentGames["gameID"].currentPlayer] = 1
        currentGames["gameID"].maxMana[otherPlayer]   = 0

        currentGames["gameID"].currentMana = {}
        currentGames["gameID"].currentMana[currentGames["gameID"].currentPlayer] = 1
        currentGames["gameID"].currentMana[otherPlayer]   = 0


        return "gameID"
    },
    endTurn: function(gameID, currentPlayer){
        if (currentPlayer !== currentGames[gameID].currentPlayer){
            return false
        }

        currentGames[gameID].currentPlayer = currentGames[gameID].players.filter(item => item !== currentGames[gameID].currentPlayer)[0]
        currentGames["gameID"].maxMana[currentGames[gameID].currentPlayer] += currentGames["gameID"].maxMana[currentGames[gameID].currentPlayer]== 10? 0 : 1
        currentGames["gameID"].currentMana[currentGames[gameID].currentPlayer] = currentGames["gameID"].maxMana[currentGames[gameID].currentPlayer]

        handService.addCardToHand(gameID,currentGames[gameID].currentPlayer,deckService.drawCard(gameID,currentGames[gameID].currentPlayer))

        return currentGames[gameID].currentPlayer
    },
    getCurrentPlayerMaxMana: function(gameID){
        return currentGames["gameID"].maxMana[this.getCurrentPlayer(gameID)]
    },
    getCurrentPlayerRemainingMana : function(gameID){
        return 1
    },

    getPlayerCardsInHand : function(gameID, player){
        let requestedPlayer = player === undefined? this.getCurrentPlayer(gameID): player

        return handService.getHandForPlayer(gameID, requestedPlayer)
    },

    getCurrentPlayer : function (gameID){
        return currentGames[gameID].currentPlayer
    },

    playCardFromPlayerHand : function (gameID, player, card){
        const theGame = currentGames[gameID]
        if (theGame === undefined){
            return {error: 'gameNotFound'}
        }

        if (player !== theGame.currentPlayer){
            return {error: 'wrongPlayer'}
        }
        if (!handService.isCardInHand(gameID, player, card)){
            return {error: 'cardNotFound'}
        }
        if (theGame.currentMana[theGame.currentPlayer] < card.cost){
            return {error: 'notEnoughMana'}
        }

        console.log(theGame.currentMana[theGame.currentPlayer])
        theGame.currentMana[theGame.currentPlayer] -= card.cost

        return true
    }


}