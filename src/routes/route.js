const express = require('express');
const router = express.Router();


let players =
   [
       {
           "name": "manish",
           "dob": "1/1/1995",
           "gender": "male",
           "city": "jalandhar",
           "sports": [
               "swimming"
           ]
       },
       {
           "name": "gopal",
           "dob": "1/09/1995",
           "gender": "male",
           "city": "delhi",
           "sports": [
               "soccer"
           ]
       },
       {
           "name": "lokesh",
           "dob": "1/1/1990",
           "gender": "male",
           "city": "mumbai",
           "sports": [
               "soccer"
           ]
       },
   ]


router.post("/players", function(req, res) {
    let userName=req.body.name
    let userDob=req.body.dob
    let userGender=req.body.gender
    let userCity=req.body.city
    let userSports=req.body.sports

    let newPlayer={}
    newPlayer.name=userName
    newPlayer.dob=userDob
    newPlayer.gender=userGender
    newPlayer.city=userCity
    newPlayer.sports=userSports

    for(let i=0;i<players.length;i++){
        if(players[i].name===userName){
            res.send("player already exits")
        }
    }
    players.push(newPlayer)
    res.send(  { data: players , status: true }  )

})


module.exports = router;