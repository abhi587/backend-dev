const BookModel = require('../models/bookModel')
const UserModel = require('../models/userModel')
const moment = require("moment");
const ReviewModel = require('../models/reviewModel');
const { default: mongoose } = require('mongoose');


//**************************VALIDATION FUNCTION*******************/

const isValid = function(value){
    if(typeof value == "undefined" || value == null) return false;
    if(typeof value == "string" && value.trim().length > 0) return true;
};

const isValidRequestBody = function (object){
    return Object.keys(object).length > 0;
};

const isValidIdType = function (objectId){
    return mongoose.Types.ObjectId.isValid(objectId)
};

const isValidSubcategory = function (value){
    if(typeof value == "undefined" || value == null) return false;
    if(typeof value == "string" && value.trim().length > 0) return true;
    if(typeof value == "object" && Array.isArray(value) == true) return true;
};


//************************************NEW BOOK REGISTRATION*************************/

const registerBook = async function (req, res){
    try{

        const requestBody = req.body;
        const queryParams = req.query;
        const decodedToken = req.decodedToken;

        //query params should empty
        if(isValidRequestBody(queryParams)){
            return res
                .status(400)
                .send({status: false , message: "Invalid input"});
        }

        if(!isValidRequestBody(requestBody)){
            return res
                .status(400)
                .send({status: false , message: "book data is required"})
        }

    }catch(error){

        res
        .status(500)
        .send({error: error.message});

    }
}