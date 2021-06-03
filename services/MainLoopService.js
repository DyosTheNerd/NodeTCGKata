const deckService = require("./DeckService")
const handService = require("./HandService")

let currentGames = {}

getInactivePlayer = function(gameID){
    return currentGames[gameID].players.filter(item => item !== currentGames[gameID].currentPlayer)[0]
}

let gameIDCounter = 0

generateNewGameID = function(){
    gameIDCounter += 1
    return "gameID" + gameIDCounter
}

setupBasicsAndPlayers = function (gameID, players){
    currentGames[gameID] = {}
    currentGames[gameID].players = players
    currentGames[gameID].currentLife = {}
    currentGames[gameID].maxMana = {}
    currentGames[gameID].currentMana = {}
    players.forEach(pl=>{
        currentGames[gameID].maxMana[pl] = 0
        currentGames[gameID].currentMana[pl] = 0
        currentGames[gameID].currentLife[pl] = 0
    })
}

setupHands = function(gameID){

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

        let gameID = generateNewGameID()

        setupBasicsAndPlayers(gameID,players)



        players.forEach(pl =>{
            currentGames[gameID].currentLife[pl] = 30

            deckService.initializeBasicDeckForPlayerAndGame(gameID,pl)
            handService.initializeHand(gameID,pl)
            handService.addCardToHand(gameID,pl,deckService.drawCard(gameID,pl))
            handService.addCardToHand(gameID,pl,deckService.drawCard(gameID,pl))
            handService.addCardToHand(gameID,pl,deckService.drawCard(gameID,pl))
        })

        startTurnForPlayer(gameID,players[0])



        return gameID
    },
    endTurn: function(gameID, currentPlayer){
        if(currentGames[gameID].isOver){
            return {error: 'gameOver'}
        }
        if (currentPlayer !== currentGames[gameID].currentPlayer){
            return {error: 'wrongPlayer'}
        }
        let nextPlayer = currentGames[gameID].players.filter(item => item !== currentGames[gameID].currentPlayer)[0]

        return startTurnForPlayer(gameID,nextPlayer)
    },
    getCurrentPlayerMaxMana: function(gameID){
        return currentGames[gameID].maxMana[this.getCurrentPlayer(gameID)]
    },
    getCurrentPlayerRemainingMana : function(gameID){
        let currentGame = currentGames[gameID]
        if (currentGame === undefined){
            return {error: 'gameNotFound'}
        }

        return currentGame.currentMana[this.getCurrentPlayer(gameID)]
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
    },

    archive : function(gameID){
        handService.archive(gameID)

        deckService.archive(gameID)

        return true
    }


}