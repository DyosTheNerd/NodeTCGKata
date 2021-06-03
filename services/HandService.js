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

const getIndexOfCard = function(gameID, playerID, card){
    const hand = getHand(gameID,playerID)
    let found = -1

    hand.forEach((cardFromHand, ind) =>{

        if(cardFromHand.cost === card.cost){
            found = ind
        }
    })
    return found
}


module.exports = {
    getHandForPlayer: function(gameID, playerID){

        return getHand(gameID,playerID)
    },
    addCardToHand : function(gameID, playerID, card){

        const theHand = getHand(gameID,playerID)
        if (theHand.length === 5){
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

        return (getIndexOfCard(gameID, playerID, card) !== -1)
    },

    discardCard : function (gameID, playerID, card){
        if (!this.isCardInHand(gameID, playerID, card)){
            return {error: "cardNotInHand"}
        }
        let hand = getHand(gameID,playerID)
        const ind = getIndexOfCard(gameID, playerID, card)
        if (ind > -1) {
            hand.splice(ind,1)
        }

        return true
    },

    archive : function (gameID){

    }


}
