const express = require('express');
const router = express.Router();
const UserController = require("../controllers/userController")

const TokenValidator = require('../middleWares/tokenValidate')

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/users" , UserController.createUser)

router.post("/login", UserController.login)

router.get("/users/:userId", TokenValidator.validateToken, UserController.getUser)

router.put("/users/:userId", TokenValidator.validateToken, UserController.updateUser)

router.delete("/users/:userId",  TokenValidator.validateToken, UserController.deleteUser)

module.exports = router;