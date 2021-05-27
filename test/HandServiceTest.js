expect = require("chai").expect
let testedService = require("../services/HandService")

describe("basic Hand interface", ()=>{
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

})