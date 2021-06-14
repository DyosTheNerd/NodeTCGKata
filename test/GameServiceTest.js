expect = require("chai").expect
const service = require("../services/GameService")

const loopService = require("../services/MainLoopService")


describe("game API functions", ()=> {

    let gameID = ""
    beforeEach(()=>{
        gameID = loopService.newGame(["playerA", "playerB"])
    })

    it("should have a method to get the spectator game state in one call", ()=>{

        expect(service.getGameState(gameID)).to.not.equal(null)
    })

    it("should not have hand details about either player for a spectator request", ()=>{
        let theSpectatorState = service.getGameState(gameID)

        expect(theSpectatorState.players[0].hand).to.be.null
        expect(theSpectatorState.players[1].hand).to.be.null
        expect(theSpectatorState.players[0].handSize).to.be.equal(4)
        expect(theSpectatorState.players[1].handSize).to.be.equal(3)
    })



})