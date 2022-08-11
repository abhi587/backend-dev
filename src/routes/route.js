const express = require('express');
const router = express.Router();


let person=[
    {
        name:"pk",
        age:10,
        votingStatus:false
    },{
        name:"sk",
        age:10,
        votingStatus:false
    },{
        name:"AA",
        age:70,
        votingStatus:false
    },{
        name:"SC",
        age:5,
        votingStatus:false
    },{
        name:"HO",
        age:40,
        votingStatus:false
    }
]

router.post("/votingStatus" , function(req, res) {
    const votingAge=req.query.votingAge;
    const votingPerson=person.filter(ele=>ele.age>votingAge? ele.votingStatus=true : ele.votingStatus=false)
    res.send(votingPerson)
})


module.exports = router;