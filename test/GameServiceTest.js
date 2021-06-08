expect = require("chai").expect
const service = require("../services/GameService")

const loopService = require("../services/MainLoopService")


describe("game API functions", ()=> {

    it("should have a method to get the fully described game in one call", ()=>{

        let gameID = loopService.newGame(["playerA", "playerB"])
        expect(service.getGameState(gameID)).to.not.equal(null)
    })

})