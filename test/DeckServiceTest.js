expect = require("chai").expect
const service = require("../services/DeckService")

describe("basic start of turn draw", ()=>{

    let gameID = "myGameID"
    it("should have a method to initialize a basic deck", ()=>{

        expect(service.initializeBasicDeckForPlayerAndGame(gameID, "PlayerA")).to.be.a("String")
    })

    it ("should use different decks for different players", ()=>{
        service.initializeBasicDeckForPlayerAndGame(gameID, "PlayerB")

        drawnCard = service.drawCard("myGameID", "PlayerA")

        expect(service.getNumberOfRemainingCardsInDeck(gameID, "PlayerB")).to.be.equal(20)
    })

    it ("should use different decks for different games with same player", ()=>{
        service.initializeBasicDeckForPlayerAndGame("myGameID2", "PlayerA")

        drawnCard = service.drawCard(gameID, "PlayerA")

        expect(service.getNumberOfRemainingCardsInDeck("myGameID2", "PlayerA")).to.be.equal(20)
    })

    describe ("tests with the default basic deck", () => {
        beforeEach(()=>{
            service.initializeBasicDeckForPlayerAndGame(gameID, "PlayerA")
        })

        it("should have a method that returns the number of remaining cards in the deck", ()=>{
            expect(service.getNumberOfRemainingCardsInDeck(gameID, "PlayerA")).to.be.equal(20)
        })

        it("should return a card object if there are cards in the deck",()=>{
            drawnCard = service.drawCard(gameID, "PlayerA")
            expect(drawnCard.cost).to.be.lessThanOrEqual(8)
            expect(drawnCard.cost).to.be.greaterThanOrEqual(0)
        })

        it("should decrease the number of cards remaining in the the deck by one after a draw", ()=>{
            initialDecksize = service.getNumberOfRemainingCardsInDeck(gameID, "PlayerA")
            drawnCard = service.drawCard(gameID, "PlayerA")
            expect(service.getNumberOfRemainingCardsInDeck(gameID, "PlayerA")).to.be.equal(initialDecksize-1)
        })

        it("drawing five cards should return at least one card with a different value", ()=>{
            let drawnCards = []
            for (let i = 0 ; i < 5; i++){
                drawnCards.push(service.drawCard(gameID, "PlayerA"))
            }
            drawnCards.sort((itemA, itemB)=>{itemA.cost < itemB.cost})
            let lastCost = -1
            for (let i in drawnCards){
                let item = drawnCards[i]
                if (lastCost !== item.cost && lastCost > -1){
                    return
                }
                lastCost = item.cost

            }
            expect(lastCost).to.be.equal(-2)
        })



        it("should randomize the deck", ()=>{
            let drawnCards = []

            for (let i = 0 ; i < 5; i++){
                drawnCards.push(service.drawCard(gameID, "PlayerA"))
                service.initializeBasicDeckForPlayerAndGame(gameID, "PlayerA")
            }
            drawnCards.sort((itemA, itemB)=>{itemA.cost < itemB.cost})
            let lastCost = -1
            for (let i in drawnCards){
                let item = drawnCards[i]
                if (lastCost !== item.cost && lastCost > -1){
                    return
                }
                lastCost = item.cost

            }
            expect(lastCost).to.be.equal(-2)
        })

        it("should return -1 if the deck is empty", ()=>{
            expect(false).to.equal(true)
        })

        it("should delete game data from the cache when archiving", ()=>{


            service.archive(gameID, "PlayerA")

            expect(service.getNumberOfRemainingCardsInDeck(gameID, "PlayerA").error).to.be.equal("deckNotFound")
        })
    })
})