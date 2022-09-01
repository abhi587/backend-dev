const express = require('express');
const router = express.Router();
const CowinController= require("../controllers/cowinController")
const MemeController = require("../controllers/memeController")
const WeatherController = require("../controllers/weatherController")


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


//cowin vaccine 
router.get("/cowin/states", CowinController.getStates)
router.get("/cowin/districtsInState/:stateId", CowinController.getDistricts)
router.get("/cowin/getByPin", CowinController.getByPin)
router.post("/cowin/getOtp", CowinController.getOtp)

router.get("/getByDistrict", CowinController.getByDistrict)

//get meme
router.get('/getMemes',MemeController.getMemes)
router.post('/createMemes',MemeController.createMemes)

// get weather
router.get('/getWeather',WeatherController.getWeather)
router.get('/tempOfLondon',WeatherController.tempOfLondon)
router.get('/tempOfcities',WeatherController.tempOfCities)

module.exports = router;