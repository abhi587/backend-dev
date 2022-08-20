const AuthorModel= require("../models/authorModel")

const createAuthor= async function (req, res) {
    
    let authorCreated = await AuthorModel.create(req.body)
    res.send({data: authorCreated})
}


const getAuthorsData= async function (req, res) {
    let listOfAuthors = await AuthorModel.find()
    res.send({data: listOfAuthors})
}

module.exports.createAuthor= createAuthor
module.exports.getAuthorsData= getAuthorsData