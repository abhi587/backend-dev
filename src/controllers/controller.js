const {count} = require("console")

const testOne = async function(req,res){
    res.send({msg: "first api is done"})
}

const testTwo = async function(req,res){
    res.send({msg: "second api is done"})
}

const testThree = async function(req,res){
    res.send({msg: "third api is done"})
}

const testFour = async function(req,res){
    res.send({msg: "fourth api is done"})
}

module.exports.testOne=testOne
module.exports.testTwo=testTwo
module.exports.testThree=testThree
module.exports.testFour=testFour
