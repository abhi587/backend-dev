const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')
const BookController = require('../controllers/bookController')
const ReviewController = require('../controllers/reviewController')
const MiddleWares = require('../middlewares/auth')


//test-api
router.get('/test-me',  function(req, res){
    res.send({status:true, message : "test-api working fine"})
})


//************************************USER****************************************** */    


// new user register and user login
router.post('/register', UserController.registerUser)
router.get('/login', UserController.userLogin)



module.exports = router