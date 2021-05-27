const hands = {}

const getHandID = function(gameID, playerID){
    return gameID + ":" + playerID
}

const getHand = function(gameID, playerID){
    const theHand = getHandID(gameID,playerID)
    if (hands[theHand] === undefined){
        hands[theHand] = []
    }
    return hands[theHand]
}

module.exports = {
    getHandForPlayer: function(gameID, playerID){

        return getHand(gameID,playerID)
    },
    addCardToHand : function(card, gameID, playerID){

        const theHand = getHand(gameID,playerID)
        if (theHand.length == 5){
            return false
        }

        theHand.push(card)

        return true
    }
}
