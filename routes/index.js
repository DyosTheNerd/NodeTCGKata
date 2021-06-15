router = require("express").Router()

let gameService = require("../services/GameService")


router.get("/", (req, res) =>{

    res.json = gameService.getGameState(req.params.id)
})


module.exports = router
