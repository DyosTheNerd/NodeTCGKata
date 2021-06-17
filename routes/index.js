router = require("express").Router()

let gameService = require("../services/GameService")




router.get("/", (req, res,next) =>{
    try {
        res.json = gameService.getGameState(req.query.id)
    }
    catch(e){
        next(e)
    }
})

router.use((err,req,res,next) => {
    console.error(err.stack)
    res.status(404).send("Something broke")
})




module.exports = router
