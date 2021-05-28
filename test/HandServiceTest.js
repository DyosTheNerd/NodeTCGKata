const expect = require("chai").expect
const testedService = require("../services/HandService")

describe("basic Hand interface", ()=>{

    beforeEach("initialze hand", ()=>{
        testedService.initializeHand("gameID", "playerA" )
    })

    it("should have a method to query a players hand for a game", ()=>{
        testedService.getHandForPlayer("playerA", "gameID")
    })

    it("should have a function to add a card to a players hand",()=>{
        expect(testedService.addCardToHand({cost:3},"playerA", "gameID")).to.be.equal(true)
    })

    describe("mechanics when adding cards", ()=>{
        it("should return a card just added when querying the hand",() =>{
            testCard = {cost:3}
            testedService.addCardToHand(testCard,"playerA", "gameID")
            expect(testedService.getHandForPlayer("playerA", "gameID")).to.be.an("Array").that.contains(testCard)
        })

        it("should return false, when the handsize becomes > 5 and not add the card to hand", ()=>{
            testedService.addCardToHand({cost:0},"playerA", "gameID")
            testedService.addCardToHand({cost:0},"playerA", "gameID")
            testedService.addCardToHand({cost:0},"playerA", "gameID")
            testedService.addCardToHand({cost:0},"playerA", "gameID")
            testedService.addCardToHand({cost:0},"playerA", "gameID")

            testCard = {cost:3}
            expect(testedService.addCardToHand(testCard,"playerA", "gameID")).to.be.equal(false)

            expect(testedService.getHandForPlayer("playerA", "gameID")).to.be.an("Array").that.does.not.contain(testCard)

        })

    })

    describe("mechanics for checking if cards are in hand", ()=>{
        it ("should have a method to test if a specific card is in the hand of a player for a game", ()=>{
            testedService.addCardToHand({cost:0},"playerA", "gameID")
            expect(testedService.isCardInHand("gameID", "playerA", {cost:0}))
        })

        it ("should have a method to test if a specific card is in the hand of a player for a game", ()=>{
            testedService.addCardToHand({cost:0},"playerA", "gameID")
            expect(testedService.isCardInHand("gameID", "playerA", {cost:0})).to.be.equal(true)
        })
    })

})