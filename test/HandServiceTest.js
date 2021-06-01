const expect = require("chai").expect
const testedService = require("../services/HandService")

describe("basic Hand interface", ()=>{

    let gameID = "gameID"

    beforeEach("initialze hand", ()=>{
        testedService.initializeHand(gameID, "playerA" )
    })

    it("should have a method to query a players hand for a game", ()=>{
        testedService.getHandForPlayer(gameID, "playerA")
    })

    it("should have a function to add a card to a players hand",()=>{
        expect(testedService.addCardToHand(gameID,"playerA", {cost:3})).to.be.equal(true)
    })

    describe("mechanics when adding cards", ()=>{
        it("should return a card just added when querying the hand",() =>{
            testCard = {cost:3}
            testedService.addCardToHand(gameID,"playerA", testCard)
            expect(testedService.getHandForPlayer(gameID,"playerA" )).to.be.an("Array").that.contains(testCard)
        })

        it("should return false, when the handsize becomes > 5 and not add the card to hand", ()=>{
            testedService.addCardToHand(gameID,"playerA", {cost:0})
            testedService.addCardToHand(gameID,"playerA", {cost:0})
            testedService.addCardToHand(gameID,"playerA", {cost:0})
            testedService.addCardToHand(gameID,"playerA", {cost:0})
            testedService.addCardToHand(gameID,"playerA", {cost:0})

            testCard = {cost:3}
            expect(testedService.addCardToHand(gameID,"playerA", testCard)).to.be.equal(false)

            expect(testedService.getHandForPlayer(gameID, "playerA")).to.be.an("Array").that.does.not.contain(testCard)

        })

    })

    describe("mechanics for checking if cards are in hand", ()=>{
        it ("should have a method to test if a specific card is in the hand of a player for a game", ()=>{
            testedService.addCardToHand(gameID, "playerA",{cost:0})
            expect(testedService.isCardInHand(gameID, "playerA", {cost:0}))
        })

        it ("should have a method to test if a specific card is in the hand of a player for a game", ()=>{
            testedService.addCardToHand(gameID, "playerA",{cost:0})
            expect(testedService.isCardInHand(gameID, "playerA", {cost:0})).to.be.equal(true)
        })

        it ("should return false if a card is checked that is not in the players hand", ()=>{
            testedService.addCardToHand(gameID, "playerA",{cost:0})
            expect(testedService.isCardInHand(gameID, "playerA", {cost:1})).to.be.equal(false)
        })
    })

})