expect = require("chai").expect

service = require("../services/MainLoopService")

describe("basic game setup", ()=>{
    it("should have a method to open a game between two players", ()=>{
        expect(service.newGame(["playerA", "playerB"])).to.be.a("String")
    })
    it("" )

})