const expect = require("chai").expect
const testedService = require("../services/HandService")

describe("basic Hand interface", ()=>{

    let gameID = "gameID"

    beforeEach("initialize hand", ()=>{
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

        it("should return false, when the hand size becomes > 5 and not add the card to hand", ()=>{
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

    describe ("discard mechanics", ()=>{
        it("should check if the card is actually in the players hand", ()=>{
            let testCard = {cost:3}
            testedService.addCardToHand(gameID,"playerA", testCard)

            let old = testedService.isCardInHand

            let called = false
            testedService.isCardInHand = function (gameID, playerID, card){
                called = true
                old(gameID, playerID, card)
            }

            testedService.discardCard(gameID,"playerA", testCard)

            expect(called).to.be.equal(true)

            testedService.isCardInHand = old

        })

        it ("should return an error if the card is not in hand", ()=>{
            let testCard = {cost:2}
            let notInHandCard = {cost:4}
            testedService.addCardToHand(gameID,"playerA", testCard)

            expect(testedService.discardCard(gameID,"playerA", notInHandCard).error).to.be.equal("cardNotInHand")
        })

        it ("should return true for a card from the hand", ()=>{
            let testCard = {cost:5}

            testedService.addCardToHand(gameID,"playerA", testCard)

            expect(testedService.discardCard(gameID,"playerA", testCard)).to.be.equal(true)
        })

        it ("should decrease the number of cards in hand after discard", ()=>{
            let testCard = {cost:5}

            testedService.addCardToHand(gameID,"playerA", testCard)

            testedService.discardCard(gameID,"playerA", testCard)

            expect(testedService.getHandForPlayer(gameID,"playerA")).to.be.an("array").with.length(0)

            expect(testedService.discardCard(gameID,"playerA", testCard).error).to.be.equal("cardNotInHand")
        })

        it("should also discard equivalent but  not necessary identical cards",()=>{

            expect(testedService.getHandForPlayer(gameID,"playerA")).to.be.an("array").with.length(0)

            let addedCard = {cost:5}

            let discardableCard = {cost:5}

            testedService.addCardToHand(gameID,"playerA", addedCard)

            expect(testedService.discardCard(gameID,"playerA", discardableCard)).to.be.equal(true)

            expect(testedService.getHandForPlayer(gameID,"playerA")).to.be.an("array").with.length(0)
        })

    })

})