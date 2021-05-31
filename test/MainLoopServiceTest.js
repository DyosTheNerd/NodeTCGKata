expect = require("chai").expect

const service = require("../services/MainLoopService")

describe("basic game setup", ()=>{
    it("should have a method to open a game between two players", ()=>{
        expect(service.newGame(["playerA", "playerB"])).to.be.a("String")
    })

    it("should initialize a basic deck for each player when starting a regular game", ()=>{
        deckService = require("../services/DeckService")
        deckCalls = {gameIDs : [], playerNames: []}

        const old = deckService.initializeBasicDeckForPlayerAndGame

        deckService.initializeBasicDeckForPlayerAndGame = function(gameID, playerName){
            deckCalls.gameIDs.push(gameID)
            deckCalls.playerNames.push(playerName)
        }
        gameID = service.newGame(["playerA", "playerB"])

        expect(deckCalls.gameIDs[0]).to.be.equal(gameID)
        expect(deckCalls.gameIDs[1]).to.be.equal(gameID)
        expect(deckCalls.playerNames).to.contain("playerA")
        expect(deckCalls.playerNames).to.contain("playerB")

        deckService.initializeBasicDeckForPlayerAndGame = old
    })

    it("should draw cards from the deck when starting the game", ()=>{
        deckService = require("../services/DeckService")
        deckCalls = {gameIDs : [], playerNames: []}

        const old = deckService.drawCard

        testCards = [0,0,1,1,2,2,3]

        deckService.drawCard = function(gameID, playerName){
            deckCalls.gameIDs.push(gameID)
            deckCalls.playerNames.push(playerName)
            return testCards.pop()
        }
        gameID = service.newGame(["playerA", "playerB"])

        for (i = 0; i < 6; i++){
            expect(deckCalls.gameIDs[i]).to.be.equal(gameID)
        }
        expect(deckCalls.playerNames.filter(item => item == "playerA")).to.be.an("Array").of.length(4)
        expect(deckCalls.playerNames.filter(item => item == "playerB")).to.be.an("Array").of.length(3)

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
        gameID = service.newGame(["playerA", "playerB"])

        for (i = 0; i < 6; i++){
            expect(callParams.gameIDs[i]).to.be.equal(gameID)
        }
        expect(callParams.playerNames.filter(item => item == "playerA")).to.be.an("Array").of.length(4)
        expect(callParams.playerNames.filter(item => item == "playerB")).to.be.an("Array").of.length(3)

        handService.addCardToHand = old
    })

    it("should have a function to play a card from hand for the active player", ()=>{
        deckService = require("../services/DeckService")

        const oldFunc = deckService.drawCard
        deckService.drawCard = function(gameID, playerName){

            return {cost:0}
        }
        service.endTurn("playerA", "gameID")
        service.endTurn("playerB", "gameID")
        expect(service.playCardFromPlayerHand("gameID","playerA",{cost:0})).to.be.equal(true)

        deckService.drawCard = oldFunc
    })

    describe("playCardFromPlayerHand spec", ()=>{

        it("should prevent a play for an inactive match", ()=>{
            deckService = require("../services/DeckService")

            errorObj = service.playCardFromPlayerHand("notExistingGame","playerA",{cost:0})
            expect(errorObj.error).to.be.equal("gameNotFound")
        })

        it("should prevent to play a card from hand for the inactive player", ()=>{
            deckService = require("../services/DeckService")

            errorObj = service.playCardFromPlayerHand("gameID","playerB",{cost:0})
            expect(errorObj.error).to.be.equal("wrongPlayer")
        })

        it("should check if the card is in the active players hand", ()=>{
            handService = require("../services/HandService")

            let called = false

            handService.isCardInHand = function(gameID, playerName, card){
                called = true
                return true
            }
            service.playCardFromPlayerHand("gameID","playerA",{cost:0})
            expect(called).to.be.equal(true)
        })

        it("should prevent to play a card that is in not the active players hand", ()=>{
            handService = require("../services/HandService")


            handService.isCardInHand = function(gameID, playerName, card){
                return false
            }

            expect(service.playCardFromPlayerHand("gameID","playerA",{cost:0}).error).to.be.equal("cardNotFound")
        })

    })



    describe("game loop functions", ()=>
    {
        beforeEach(() =>{
            gameID = service.newGame(["playerA", "playerB"])
        })
        it("should have a method to end a players turn", () => {

            expect(service.endTurn("playerA", gameID)).to.be.equal("playerB", "other player name")
        })
        it("after first turn was ended, current player should be player B", ()=>{
            service.endTurn("playerA", gameID)
            expect(service.getCurrentPlayer(gameID)).to.be.equal("playerB", "other player name")
        })

        it("should prevent the end turn action, when a different player is handed and return false", ()=>{
            expect(service.endTurn("playerB", gameID)).to.be.equal(false)
            expect(service.getCurrentPlayer(gameID)).to.be.equal("playerA")
        })



        it("should have a method to query current maximum mana of active player", () =>{
            expect(service.getCurrentPlayerMaxMana(gameID)).to.be.equal(1)
        })

        it("should increase max mana of a player everytime that players turn starts", ()=>{
            service.endTurn("playerA", gameID)

            expect(service.getCurrentPlayerMaxMana(gameID)).to.be.equal(1)
            service.endTurn("playerB", gameID)
            expect(service.getCurrentPlayerMaxMana(gameID)).to.be.equal(2)
            service.endTurn("playerA", gameID)
            expect(service.getCurrentPlayerMaxMana(gameID)).to.be.equal(2)

        })

        it("should only increase the max mana of a playerup to 10", ()=>{
            for (i = 0; i < 13; i ++){
                service.endTurn("playerA", gameID)
                service.endTurn("playerB", gameID)
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
            service.endTurn("playerA", gameID)

            expect(service.getPlayerCardsInHand(gameID, "playerB")).to.be.an("Array").with.length(4)

            service.endTurn("playerB", gameID)

            expect(service.getPlayerCardsInHand(gameID, "playerA")).to.be.an("Array").with.length(5)
        })

    })
})