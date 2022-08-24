const express = require('express');
const router = express.Router();
const Controller= require("../controllers/controller")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.get("/test-1",Controller.testOne)
router.get("/test-2",Controller.testTwo)
router.get("/test-3",Controller.testThree)
router.get("/test-4",Controller.testFour)


module.exports = router;