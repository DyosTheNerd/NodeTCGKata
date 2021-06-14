expect = require("chai").expect

const service = require("../services/MainLoopService")

describe("basic game setup", ()=>{



    it("should have a method to open a game between two players", ()=>{
        expect(service.newGame(["playerA", "playerB"])).to.be.a("String")
    })

    it ("should open games with different ids each time for the same players",()=>{
        let firstgame = service.newGame(["playerA", "playerB"])
        expect(service.newGame(["playerA", "playerB"])).to.be.not.equal(firstgame)
    })

    it("should initialize a basic deck for each player when starting a regular game", ()=>{
        deckService = require("../services/DeckService")
        deckCalls = {gameIDs : [], playerNames: []}

        const old = deckService.initializeBasicDeckForPlayerAndGame

        deckService.initializeBasicDeckForPlayerAndGame = function(gameID, playerName){
            deckCalls.gameIDs.push(gameID)
            deckCalls.playerNames.push(playerName)
            old(gameID,playerName)
        }
        let gameID = service.newGame(["playerA", "playerB"])

        expect(deckCalls.gameIDs[0]).to.be.equal(gameID)
        expect(deckCalls.gameIDs[1]).to.be.equal(gameID)
        expect(deckCalls.playerNames).to.contain("playerA")
        expect(deckCalls.playerNames).to.contain("playerB")

        deckService.initializeBasicDeckForPlayerAndGame = old
    })

    it("should draw cards from the deck when starting the game", ()=>{
        const deckService = require("../services/DeckService")
        const deckCalls = {gameIDs : [], playerNames: []}

        const old = deckService.drawCard

        let testCards = [0,0,1,1,2,2,3]

        deckService.drawCard = function(gameID, playerName){
            deckCalls.gameIDs.push(gameID)
            deckCalls.playerNames.push(playerName)
            return testCards.pop()
        }
        let gameID = service.newGame(["playerA", "playerB"])

        for (i = 0; i < 6; i++){
            expect(deckCalls.gameIDs[i]).to.be.equal(gameID)
        }
        expect(deckCalls.playerNames.filter(item => item === "playerA")).to.be.an("Array").of.length(4)
        expect(deckCalls.playerNames.filter(item => item === "playerB")).to.be.an("Array").of.length(3)

        deckService.drawCard = old
    })

    it("should add cards to the hands when starting the game", ()=>{
        const handService = require("../services/HandService")
        const callParams =  {gameIDs : [], playerNames: [], cards : []}

        const old = handService.addCardToHand

        handService.addCardToHand = function( gameID, playerName,card){
            callParams.gameIDs.push(gameID)
            callParams.playerNames.push(playerName)
            callParams.cards.push(card)
            return true
        }
        let gameID = service.newGame(["playerA", "playerB"])

        for (i = 0; i < 6; i++){
            expect(callParams.gameIDs[i]).to.be.equal(gameID)
        }
        expect(callParams.playerNames.filter(item => item === "playerA")).to.be.an("Array").of.length(4)
        expect(callParams.playerNames.filter(item => item === "playerB")).to.be.an("Array").of.length(3)

        handService.addCardToHand = old
    })

    it("should have a function to play a card from hand for the active player", ()=>{

        let gameID = service.newGame(["playerA", "playerB"])


        const deckService = require("../services/DeckService")

        const oldFunc = deckService.drawCard
        deckService.drawCard = function(gameID, playerName){

            return {cost:0}
        }
        service.endTurn( gameID,"playerA")
        service.endTurn( gameID,"playerB")
        expect(service.playCardFromPlayerHand(gameID,"playerA",{cost:0})).to.be.equal(true)

        deckService.drawCard = oldFunc
    })

    it("should have a method to get the fully described game in one call", ()=>{

        let gameID = service.newGame(["playerA", "playerB"])
        expect(service.getGameState(gameID)).to.not.equal(null)
    })


    describe("gameState function spec", ()=>{
        let gameID
        beforeEach(()=>{
            gameID = service.newGame(["playerA", "playerB"])
        })

        it("should return both players", ()=>{
            expect(service.getGameState(gameID).players).to.be.an("Array").with.length(2)
        })

        it("player object should contain current life points", ()=>{
            expect(service.getGameState(gameID).players[0].currentLife).to.be.equal(30)
        })

        it("player object should contain current max mana points", ()=>{
            expect(service.getGameState(gameID).players[0].maxMana).to.be.equal(1)
        })

        it("player object should contain current mana points", ()=>{
            expect(service.getGameState(gameID).players[0].currentMana).to.be.equal(1)
        })

        it("player object should contain both player hand details", ()=>{
            expect(service.getGameState(gameID).players[0].hand).to.be.an("Array").with.length(4)
        })

        it("player object should contain both player deck card number", ()=>{
            expect(service.getGameState(gameID).players[0].remainingDeckSize).to.be.equal(16)
            expect(service.getGameState(gameID).players[0].remainingDeckSize).to.be.equal(16)
        })

        it("should contain information about discarded cards", ()=>{
            expect(service.getGameState(gameID).players[0].discard).to.be.an("Array")
        })


    })


    describe("discarded cards mechanics", ()=>{

        let gameID = ""
        beforeEach(() =>{
            gameID = service.newGame(["playerA", "playerB"])
        })

        it ("should have a function to query the discarded cards", ()=>{
            expect(service.getDiscardedCards(gameID, "playerA")).to.be.an("Array")
        })

        it("should add a card to the discard pile after it has been played", ()=>{
            const deckService = require("../services/DeckService")

            let old = deckService.drawCard
            deckService.drawCard = function(gameID, playerName){
                return {cost:1}
            }

            service.endTurn(gameID,  "playerA")

            service.playCardFromPlayerHand(gameID,"playerB",{cost:1})

            expect(service.getDiscardedCards(gameID, "playerB")[0].cost).to.be.equal(1)

            deckService.drawCard = old
        })

        it("should add cards to the discard that are burned due to handsize limit", ()=>{
            for (let i = 0; i < 5; i++){
                service.endTurn(gameID,  "playerA")
                service.endTurn(gameID,  "playerB")
            }
            expect(service.getDiscardedCards(gameID, "playerB").length).to.be.be.equal(3)
            expect(service.getDiscardedCards(gameID, "playerA").length).to.be.be.equal(4)

        })


    })

    describe("playCardFromPlayerHand spec", ()=>{
        let gameID = ""
        beforeEach(() =>{
            gameID = service.newGame(["playerA", "playerB"])
        })
        it("should prevent a play for an inactive match", ()=>{


            const errorObj = service.playCardFromPlayerHand("notExistingGame","playerA",{cost:0})
            expect(errorObj.error).to.be.equal("gameNotFound")
        })

        it("should prevent to play a card from hand for the inactive player", ()=>{


            const errorObj = service.playCardFromPlayerHand(gameID,"playerB",{cost:0})
            expect(errorObj.error).to.be.equal("wrongPlayer")
        })

        it("should check if the card is in the active players hand", ()=>{
            const handService = require("../services/HandService")

            let called = false

            handService.isCardInHand = function(gameID, playerName, card){
                called = true
                return true
            }
            service.playCardFromPlayerHand(gameID,"playerA",{cost:0})
            expect(called).to.be.equal(true)
        })

        it("should prevent to play a card that is in not the active players hand", ()=>{
            const handService = require("../services/HandService")

            let old = handService.isCardInHand
            handService.isCardInHand = function(gameID, playerName, card){
                return false
            }

            expect(service.playCardFromPlayerHand(gameID,"playerA",{cost:0}).error).to.be.equal("cardNotFound")

            handService.isCardInHand = old
        })

        it ("should fail if the player does not have enough mana to play a card", () =>{
            const handService = require("../services/HandService")

            let old = handService.isCardInHand
            handService.isCardInHand = function(gameID, playerName, card){
                return true
            }

            expect(service.playCardFromPlayerHand(gameID,"playerA",{cost:10}).error).to.be.equal("notEnoughMana")

            handService.isCardInHand = old
        })

        it ("should let the player play cards up as long as they have enough mana to play for them", () =>{
            const handService = require("../services/HandService")

            let old = handService.isCardInHand
            handService.isCardInHand = function(gameID, playerName, card){
                return true
            }

            service.playCardFromPlayerHand(gameID,"playerA",{cost:1}) // play the first card is ok, since the player starts with 1 mana

            expect(service.playCardFromPlayerHand(gameID,"playerA",{cost:1}).error).to.be.equal("notEnoughMana") // the second card with same cost should fail

            handService.isCardInHand = old
        })

        it ("should refill the mana of each player at the start of their new turn", () =>{
            const handService = require("../services/HandService")

            let old = handService.isCardInHand
            handService.isCardInHand = function(gameID, playerName, card){
                return true
            }

            service.playCardFromPlayerHand(gameID,"playerA",{cost:1}) // spend all available mana (1) on the first turn

            service.endTurn(gameID, "playerA")

            service.endTurn(gameID, "playerB")

            expect(service.playCardFromPlayerHand(gameID,"playerA",{cost:1}).error).to.be.undefined

            expect(service.playCardFromPlayerHand(gameID,"playerA",{cost:1}).error).to.be.undefined

            expect(service.playCardFromPlayerHand(gameID,"playerA",{cost:1}).error).to.be.equal("notEnoughMana") // the second card with same cost should fail

            handService.isCardInHand = old
        })

        it("should deal one damage to a player when the turn starts and the deck is empty", ()=>{
            service.endTurn(gameID, "playerA")

            const deckService = require("../services/DeckService")

            expect(service.getPlayerLifePoints(gameID, "playerA")).to.be.equal(30)

            let old = deckService.drawCard
            deckService.drawCard = function(gameID, playerName){
                return {error:"noCardInDeck"}
            }

            service.endTurn(gameID, "playerB")

            expect(service.getPlayerLifePoints(gameID, "playerA")).to.be.equal(29)

            deckService.drawCard = old

        })

        it("should let the player loose the game when loosing life by empty deck", ()=>{
            const deckService = require("../services/DeckService")

            service.endTurn(gameID, "playerA")

            let old = deckService.drawCard
            deckService.drawCard = function(gameID, playerName){
                return {error:"noCardInDeck"}
            }

            for(let i = 0; i < 29; i++){
                service.endTurn(gameID, "playerB")

                expect(service.getPlayerLifePoints(gameID, "playerA")).to.be.equal(29 - i)

                service.endTurn(gameID, "playerA")
            }

            service.endTurn(gameID, "playerB")


            expect(service.getPlayerLifePoints(gameID, "playerA")).to.be.equal(0)

            expect(service.endTurn(gameID, "playerA").error).to.be.equal("gameOver")



            deckService.drawCard = old
        })

        it("should call hand service to remove card if playable", ()=>{

            const deckService = require("../services/DeckService")

            const handService = require("../services/HandService")

            let oldDeck = deckService.drawCard

            deckService.drawCard = function(gameID, playerName){
                return {cost: 0}
            }

            let oldHand = handService.discardCard

            let called = false
            handService.discardCard = function(gameID, playerName, card) {
                called = true
                return true
            }




            service.playCardFromPlayerHand(gameID, "playerA", {cost: 0})



            deckService.drawCard = oldDeck

            handService.discardCard = oldHand

            expect (called).to.be.equal(true)

        })

    })

    describe("damage through deck empty", ()=>{
        let gameID = ""

        beforeEach(()=>{
            gameID = service.newGame(["playerA", "playerB"])
            for (let i = 0; i< 5 ; i++){
                service.endTurn(gameID,"playerA")
                service.endTurn(gameID,"playerB")
            }

            for (let i = 0; i< 4 ; i++){
                service.playCardFromPlayerHand(gameID,"playerA",{cost:6})
                service.endTurn(gameID,"playerA")
                service.endTurn(gameID,"playerB")
            }
        })

        it("should declare the other player the winner, when a player dies due to deck empty", ()=>{
            const deckService = require("../services/DeckService")

            service.endTurn(gameID, "playerA")

            let old = deckService.drawCard
            deckService.drawCard = function(gameID, playerName){
                return {error:"noCardInDeck"}
            }

            for(let i = 0; i < 6; i++){
                service.endTurn(gameID, "playerB")

                service.endTurn(gameID, "playerA")
            }


            expect(service.getWinner(gameID)).to.be.equal("playerA")


            deckService.drawCard = old
        })
    })

    describe("game ended spec", ()=>{

        let gameID = ""
        beforeEach(()=>{
            gameID = service.newGame(["playerA", "playerB"])
            for (let i = 0; i< 5 ; i++){
                service.endTurn(gameID,"playerA")
                service.endTurn(gameID,"playerB")
            }

            for (let i = 0; i< 5 ; i++){
                service.playCardFromPlayerHand(gameID,"playerA",{cost:6})
                service.endTurn(gameID,"playerA")
                service.endTurn(gameID,"playerB")
            }
        })

        it("should have a method to query a games winner after end", ()=>{

            expect(service.getWinner(gameID)).to.be.equal("playerA")

        })

        it("should prevent players from ending their turn after the game is over", ()=>{

            expect(service.endTurn(gameID, "playerA").error).to.be.equal("gameOver")

        })

        it("should have an function to archive the ended game", ()=>{
            expect(service.archive(gameID)).to.be.equal(true)
        })

        it("should call the hand service to archive the hands for the game when archiving", ()=>{
            let handService = require("../services/HandService")
            let oldFunc = handService.archive

            let called = false

            handService.archive = function (gameID){
                called = gameID
            }
            service.archive(gameID)
            expect(called).to.be.equal(gameID)

            handService.archive = oldFunc
        })

        it("should call the deck service to archive the deck for the game when archiving", ()=>{
            let deckService = require("../services/DeckService")
            let oldFunc = deckService.archive

            let calledWith = false

            deckService.archive = function (gameID){
                calledWith = gameID
            }
            service.archive(gameID)
            expect(calledWith).to.be.equal(gameID)

            deckService.archive = oldFunc
        })

        it("should notify the archive service with the outcome", ()=>{
            let archiveService = require("../services/ArchiveService")
            let oldFunc = archiveService.archive
            let calledWith = false

            archiveService.archive = function(gameObj){
                calledWith = gameObj
            }

            service.archive(gameID)
            expect(calledWith.players).to.be.an("Array").that.contains("playerA")
            expect(calledWith.players).to.be.an("Array").that.contains("playerB")
            expect(calledWith.gameID).to.be.equal(gameID)
            expect(calledWith.winner).to.be.equal("playerA")

            archiveService.archive = oldFunc
        })

        it("should remove the game from current games after it was archived", ()=>{
            service.archive(gameID)
            expect(service.playCardFromPlayerHand(gameID, "playerA",{cost:6} ).error).to.equal("gameNotFound")
        })

    })

    describe("provision of life points function", ()=>{
        const handService = require("../services/HandService")
        let old
        let gameID
        before(()=>{
            old = handService.isCardInHand
            handService.isCardInHand = function(gameID, playerName, card){
                return true
            }
        })
        after(()=>{
            handService.isCardInHand = old
        })

        beforeEach(()=>{
            gameID = service.newGame(["playerA", "playerB"])
        })


        it("should provide a function to query players life", ()=>{
            expect(service.getPlayerLifePoints(gameID, "playerA")).to.be.equal(30)
        })

        it("should decrease the life of the second player after first player played a card",()=>{
            service.playCardFromPlayerHand(gameID,"playerA",{cost:1})
            expect(service.getPlayerLifePoints(gameID, "playerB")).to.be.equal(29)
        })

        it("should decrease the life of the first player after the second player played a card",()=>{
            service.endTurn(gameID,"playerA")
            service.endTurn(gameID,"playerB")
            service.endTurn(gameID,"playerA")
            service.playCardFromPlayerHand(gameID,"playerB",{cost:2})
            expect(service.getPlayerLifePoints(gameID, "playerA")).to.be.equal(28)
        })

        it("should decrease the life of both players independently", ()=>{
            service.playCardFromPlayerHand(gameID,"playerA",{cost:1})
            expect(service.getPlayerLifePoints(gameID, "playerB")).to.be.equal(29)
            expect(service.getPlayerLifePoints(gameID, "playerA")).to.be.equal(30)

            service.endTurn(gameID,"playerA")
            service.endTurn(gameID,"playerB")
            service.endTurn(gameID,"playerA")
            service.playCardFromPlayerHand(gameID,"playerB",{cost:2})
            expect(service.getPlayerLifePoints(gameID, "playerA")).to.be.equal(28)
            expect(service.getPlayerLifePoints(gameID, "playerB")).to.be.equal(29)

        })

        it("should prevent players from playing more cards after a player reaches 0 life", ()=>{
            for (let i = 0; i< 5 ; i++){
                service.endTurn(gameID,"playerA")
                service.endTurn(gameID,"playerB")
            }

            for (let i = 0; i< 5 ; i++){
                service.playCardFromPlayerHand(gameID,"playerA",{cost:6})
                expect(service.getPlayerLifePoints(gameID, "playerB")).to.be.equal(30 - (i+1)*6)
                service.endTurn(gameID,"playerA")
                service.endTurn(gameID,"playerB")
            }
            expect(service.getPlayerLifePoints(gameID, "playerB")).to.be.equal(0)

            expect(service.playCardFromPlayerHand(gameID,"playerA",{cost:1}).error).to.be.equal("gameOver")
        })

    })

    describe("game loop functions", ()=>
    {
        let gameID = ""
        beforeEach(() =>{
            gameID = service.newGame(["playerA", "playerB"])
        })
        it("should have a method to end a players turn", () => {

            expect(service.endTurn( gameID,"playerA")).to.be.equal("playerB", "other player name")
        })
        it("after first turn was ended, current player should be player B", ()=>{
            service.endTurn(gameID, "playerA")
            expect(service.getCurrentPlayer(gameID)).to.be.equal("playerB", "other player name")
        })

        it("should prevent the end turn action, when a different player is handed and return false", ()=>{
            expect(service.endTurn( gameID,"playerB").error).to.be.equal('wrongPlayer')
            expect(service.getCurrentPlayer(gameID)).to.be.equal("playerA")
        })



        it("should have a method to query current maximum mana of active player", () =>{
            expect(service.getCurrentPlayerMaxMana(gameID)).to.be.equal(1)
        })

        it("should increase max mana of a player everytime that players turn starts", ()=>{
            service.endTurn(gameID,"playerA")

            expect(service.getCurrentPlayerMaxMana(gameID)).to.be.equal(1)
            service.endTurn(gameID,"playerB")
            expect(service.getCurrentPlayerMaxMana(gameID)).to.be.equal(2)
            service.endTurn(gameID, "playerA")
            expect(service.getCurrentPlayerMaxMana(gameID)).to.be.equal(2)

        })

        it("should only increase the max mana of a playerup to 10", ()=>{
            for (i = 0; i < 13; i ++){
                service.endTurn( gameID,"playerA")
                service.endTurn( gameID,"playerB")
            }


            expect(service.getCurrentPlayerMaxMana(gameID)).to.be.equal(10)


        })



        it("should have a method to query current remaining mana of active player", () => {
            expect(service.getCurrentPlayerRemainingMana(gameID)).to.be.equal(1)
        })


        it("should have a method to query the cards in the hand of the current player", ()=>{
            expect(service.getPlayerCardsInHand(gameID)).to.be.an("Array").with.length(4)
        })

        it("should have a method to return the current Player, and first player starts the game", ()=>{
            expect(service.getCurrentPlayer(gameID)).to.be.equal("playerA")
        })

        it("should give 4 cards to player A in the first turn", ()=>{
            expect(service.getPlayerCardsInHand(gameID, "playerA")).to.be.an("Array").with.length(4)
        })

        it("should give 3 cards to player B on setup", ()=>{
            expect(service.getPlayerCardsInHand(gameID, "playerB")).to.be.an("Array").with.length(3)
        })

        it("should draw a card at the beginning of a players turn", ()=>{
            service.endTurn(gameID,"playerA")

            expect(service.getPlayerCardsInHand(gameID, "playerB")).to.be.an("Array").with.length(4)

            service.endTurn(gameID, "playerB")

            expect(service.getPlayerCardsInHand(gameID, "playerA")).to.be.an("Array").with.length(5)
        })



    })

    describe("methods return values for nonexisting games", ()=>{
        it("should return error when query current remaining mana of active player of nonexistent game", () => {
            expect(service.getCurrentPlayerRemainingMana("NonExistentGameIDA").error).to.be.equal("gameNotFound")
        })

    })

})