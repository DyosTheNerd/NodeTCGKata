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
    addCardToHand : function(gameID, playerID, card){

        const theHand = getHand(gameID,playerID)
        if (theHand.length == 5){
            return false
        }

        theHand.push(card)

        return true
    },
    initializeHand : function (gameID,playerID){
        const theHand = getHandID(gameID,playerID)
        hands[theHand] = []
    },

    isCardInHand : function(gameID, playerID, card){
        const hand = getHand(gameID,playerID)
        let found = false

        hand.forEach(cardFromHand =>{

            if(cardFromHand.cost == card.cost){
                found = true
            }
        })
        return found
    },

    discardCard : function (gameID, playerID, card){

        return this.isCardInHand(gameID, playerID, card)
    }

}
