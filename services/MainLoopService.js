const deckService = require("./DeckService")
const handService = require("./HandService")

let currentGames = {}

getInactivePlayer = function(gameID){
    return currentGames[gameID].players.filter(item => item !== currentGames[gameID].currentPlayer)[0]
}

let gameIDCounter = 0

generateNewGameID = function(){
    gameIDCounter += 1
    return "gameid" + gameIDCounter
}

setupBasicsAndPlayers = function (gameid, players){
    currentGames[gameid] = {}
    currentGames[gameid].players = players
    currentGames[gameid].currentLife = {}
    currentGames[gameid].maxMana = {}
    currentGames[gameid].currentMana = {}
    players.forEach(pl=>{
        currentGames[gameid].maxMana[pl] = 0
        currentGames[gameid].currentMana[pl] = 0
        currentGames[gameid].currentLife[pl] = 0
    })
}

setupHands = function(gameid){

}

startTurnForPlayer = function(gameID, nextPlayer){

    currentGames[gameID].currentPlayer = nextPlayer
    currentGames[gameID].maxMana[currentGames[gameID].currentPlayer] += currentGames[gameID].maxMana[currentGames[gameID].currentPlayer] === 10? 0 : 1
    currentGames[gameID].currentMana[currentGames[gameID].currentPlayer] = currentGames[gameID].maxMana[currentGames[gameID].currentPlayer]

    handService.addCardToHand(gameID,currentGames[gameID].currentPlayer,deckService.drawCard(gameID,currentGames[gameID].currentPlayer))

    return currentGames[gameID].currentPlayer
}

module.exports = {
    newGame : function (players){

        let gameid = generateNewGameID()

        setupBasicsAndPlayers(gameid,players)



        players.forEach(pl =>{
            currentGames[gameid].currentLife[pl] = 30

            deckService.initializeBasicDeckForPlayerAndGame(gameid,pl)
            handService.initializeHand(gameid,pl)
            handService.addCardToHand(gameid,pl,deckService.drawCard(gameid,pl))
            handService.addCardToHand(gameid,pl,deckService.drawCard(gameid,pl))
            handService.addCardToHand(gameid,pl,deckService.drawCard(gameid,pl))
        })

        startTurnForPlayer(gameid,players[0])



        return gameid
    },
    endTurn: function(gameID, currentPlayer){
        if (currentPlayer !== currentGames[gameID].currentPlayer){
            return false
        }
        let nextPlayer = currentGames[gameID].players.filter(item => item !== currentGames[gameID].currentPlayer)[0]

        return startTurnForPlayer(gameID,nextPlayer)
    },
    getCurrentPlayerMaxMana: function(gameID){
        return currentGames[gameID].maxMana[this.getCurrentPlayer(gameID)]
    },
    getCurrentPlayerRemainingMana : function(gameID){
        return currentGames[gameID].currentMana[this.getCurrentPlayer(gameID)]
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

        if(theGame.isOver){
            return {error: 'gameOver'}
        }

        theGame.currentMana[theGame.currentPlayer] -= card.cost

        theGame.currentLife[getInactivePlayer(gameID)] -= card.cost

        if(theGame.currentLife[getInactivePlayer(gameID)] <= 0){
            theGame.isOver = true
            theGame.winner = theGame.currentPlayer
        }

        handService.discardCard(gameID, player, card)

        return true
    },
    getPlayerLifePoints : function(gameID, playerID){
        return currentGames[gameID].currentLife[playerID]
    }


}