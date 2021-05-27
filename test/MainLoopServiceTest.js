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

        testCards = [0,0,1,1,2,2]

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

        handService.addCardToHand = function(card, gameID, playerName){
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


    describe("game loop functions", ()=>
    {
        beforeEach(() =>{
            gameID = service.newGame(["playerA", "playerB"])
        })
        it("should have a method to end a players turn", () => {

            expect(service.endTurn("playerA", gameID)).to.be.equal("playerB", "other player name")
        })
        it("should have a method to query current maximum mana of active player", () =>{
            expect(service.getCurrentPlayerMaxMana(gameID)).to.be.equal(1)
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



    })
})