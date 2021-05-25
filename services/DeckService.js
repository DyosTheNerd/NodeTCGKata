let decks = 20
//0,0,1,1,2,2,2,3,3,3,3,4,4,4,5,5,6,6,7,8

module.exports = {

    initializeBasicDeckForPlayerAndGame : function(gameID, playerName) {
        decks = 20
        return "test"
    },

    getNumberOfRemainingCardsInDeck : function(gameID, playerName){
        current = decks
        decks -= 1
        return current
    },

    drawCard: function(gameID, playerName){
        return {cost: 5}
    }
}