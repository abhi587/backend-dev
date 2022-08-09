const express = require('express');
const myHelper = require('../util/helper')
const underscore = require('underscore')

const router = express.Router();

router.get("/sol1", function(req, res){
    let arr=[1,2,3,4,5,6,7,9]
    let sum=0
    let lastEle=arr[arr.length-1]
    for(let i=0;i<arr.length;i++){
        sum=sum+arr[i]
    }
    let sum1=(lastEle*(lastEle+1))/2
    let missingNumber=sum1-sum
    console.log(missingNumber)
    res.send({"data":missingNumber})
})

router.get('/sol2',function(req,res){
    let arr=[33,34,35,37,38]
    let sumBefore=arr[0]-1
    let lastEle=arr[arr.length-1]
    let sum=0
    for(let i=0;i<arr.length;i++){
        sum=sum+arr[i]
    }
    let sumBeforeFirst=(sumBefore*(sumBefore+1))/2
    let sumlastEle=(lastEle*(lastEle+1))/2
    let missingNumber=(sumlastEle-sumBeforeFirst)-sum
    console.log(missingNumber)
    res.send({"data":missingNumber})
})

module.exports = router;
// adding this comment for no reason