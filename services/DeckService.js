let decks = {}
//0,0,1,1,2,2,2,3,3,3,3,4,4,4,5,5,6,6,7,8

getDeckID = function(gameID, playerName)
{
    return gameID+':'+playerName
}

module.exports = {

    initializeBasicDeckForPlayerAndGame : function(gameID, playerName) {
        let i, j, deckID, current, temp

        deckID = getDeckID(gameID,playerName)

        decks[deckID] = [0,0,1,1,2,2,2,3,3,3,3,4,4,4,5,5,6,6,7,8]

        current  = decks[deckID]

        for (i = current.length -1; i > 0; i --){
            j = Math.floor(Math.random() * (i + 1));
            temp = current[j]
            current[i] = current[j]
            current[j] = temp
        }

        return deckID
    },

    getNumberOfRemainingCardsInDeck : function(gameID, playerName){
        deckID = getDeckID(gameID,playerName)
        current = decks[deckID]
        return current.length
    },

    drawCard: function(gameID, playerName){
        deckID = getDeckID(gameID,playerName)
        current = decks[deckID]

        return {cost: current.pop()}
    }
}