let decks = {}

getDeckID = function(gameID, playerName)
{
    return gameID+':'+playerName
}

module.exports = {

    initializeBasicDeckForPlayerAndGame : function(gameID, playerName) {
        let i, j, deckID, current, temp

        deckID = getDeckID(gameID,playerName)

        decks[deckID] =
              [ {cost:0},{cost:0},{cost:1},{cost:1},{cost:2},
                {cost:2},{cost:2},{cost:3},{cost:3},{cost:3},
                {cost:3},{cost:4},{cost:4},{cost:4},{cost:5},
                {cost:5},{cost:6},{cost:6},{cost:7},{cost:8}
                ]

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
        let deckID = getDeckID(gameID,playerName)
        let current = decks[deckID]
        if (current === undefined){
            return {error:"deckNotFound"}
        }
        return current.length
    },

    drawCard: function(gameID, playerName){
        let deckID = getDeckID(gameID,playerName)
        let current = decks[deckID]

        if (current === undefined){
            return {error:"deckNotFound"}
        }

        if (current.length > 0) {
            return current.pop()
        }
        else {
            return {error:"noCardInDeck"}
        }


    },

    archive : function (gameID,playerName){
        let deckID = getDeckID(gameID,playerName)
        delete decks[deckID]
    }
}