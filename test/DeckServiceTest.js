expect = require("chai").expect

service = require("../services/DeckService")

describe("basic start of turn draw", ()=>{

    it("should have a method to initialize a basic deck", ()=>{

        expect(service.initializeBasicDeckForPlayerAndGame("myGameID", "PlayerA")).to.be.a("String")
    })

    it ("should use different decks for different players", ()=>{
        service.initializeBasicDeckForPlayerAndGame("myGameID", "PlayerB")

        drawnCard = service.drawCard("myGameID", "PlayerA")

        expect(service.getNumberOfRemainingCardsInDeck("myGameID", "PlayerB")).to.be.equal(20)
    })

    it ("should use different decks for different games with same player", ()=>{
        service.initializeBasicDeckForPlayerAndGame("myGameID2", "PlayerA")

        drawnCard = service.drawCard("myGameID", "PlayerA")

        expect(service.getNumberOfRemainingCardsInDeck("myGameID2", "PlayerA")).to.be.equal(20)
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

        it("should decrease the number of cards remaining in the the deck by one after a draw", ()=>{
            initialDecksize = service.getNumberOfRemainingCardsInDeck("myGameID", "PlayerA")
            drawnCard = service.drawCard("myGameID", "PlayerA")
            expect(service.getNumberOfRemainingCardsInDeck("myGameID", "PlayerA")).to.be.equal(initialDecksize-1)
        })

        it("drawing five cards should return at least one card with a different value", ()=>{
            drawnCards = []
            for (i = 0 ; i < 5; i++){
                drawnCards.push(service.drawCard("myGameID", "PlayerA"))
            }
            drawnCards.sort((itemA, itemB)=>{itemA.cost < itemB.cost})
            lastCost = -1
            for (i in drawnCards){
                item = drawnCards[i]
                if (lastCost != item.cost && lastCost > -1){
                    return
                }
                lastCost = item.cost

            }
            expect(lastCost).to.be.equal(-2)
        })

        it("should randomize the deck", ()=>{
            drawnCards = []
            let i = 0
            for (i = 0 ; i < 5; i++){
                drawnCards.push(service.drawCard("myGameID", "PlayerA"))
                service.initializeBasicDeckForPlayerAndGame("myGameID", "PlayerA")
            }
            drawnCards.sort((itemA, itemB)=>{itemA.cost < itemB.cost})
            lastCost = -1
            for (i in drawnCards){
                item = drawnCards[i]
                if (lastCost != item.cost && lastCost > -1){
                    return
                }
                lastCost = item.cost

            }
            expect(lastCost).to.be.equal(-2)
        })
    })
})