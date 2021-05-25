expect = require("chai").expect

service = require("../services/DeckService")

describe("basic start of turn draw", ()=>{

    it("should have a method to initialize a basic deck", ()=>{

        expect(service.initializeBasicDeckForPlayerAndGame("myGameID", "PlayerA")).to.be.a("String")
    })

    describe ("tests with the default basic deck", () => {
        beforeEach(()=>{
            service.initializeBasicDeckForPlayerAndGame("myGameID", "PlayerA")
        })

        it("should have a method that returns the number of remaining cards in the deck", ()=>{
            expect(service.getNumberOfRemainingCardsInDeck("myGameID", "PlayerA")).to.be.equal(20)
        })

        it("should return a card object if there are cards in the deck",()=>{
            drawnCard = service.drawCard("myGameID", "PlayerA")
            expect(drawnCard.cost).to.be.lessThanOrEqual(8)
            expect(drawnCard.cost).to.be.greaterThanOrEqual(0)
        })

        it("should decrease the number of cards remaining in the the deck by own after a draw", ()=>{
            initialDecksize = service.getNumberOfRemainingCardsInDeck("myGameID", "PlayerA")
            drawnCard = service.drawCard("myGameID", "PlayerA")
            expect(service.getNumberOfRemainingCardsInDeck("myGameID", "PlayerA")).to.be.equal(initialDecksize-1)
        })

    })

})