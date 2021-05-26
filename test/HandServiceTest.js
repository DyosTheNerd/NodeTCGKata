expect = require("chai").expect
let testedService = require("../services/HandService")

describe("basic Hand interface", ()=>{
    it("should have a method to query a players hand for a game", ()=>{
        testedService.getHandForPlayer("playerA", "gameID")
    })
})