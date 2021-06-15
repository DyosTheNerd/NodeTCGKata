const api = require("../routes/index")
const expect = require("chai").expect
const request = require("supertest")
const app = require("../index")


describe("basic api interaction to get a gamestate", ()=>{
    it("should retrieve annonymous gamestate by id" , ()=>{

        request(app).get("/id=1").then(function(response ){
            assert(equal(response.status, 200))
        })


    })

})
