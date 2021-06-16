const api = require("../routes/index")
const expect = require("chai").expect
const request = require("supertest")
const app = require("../index").app


describe("basic api interaction to get a game state", ()=>{
    it("should return an error for an unknown game by id" , (done)=>{
            request(app).get("/?id=1").expect(404, done)
        })
})
