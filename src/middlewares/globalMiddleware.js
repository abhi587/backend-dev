const globalMiddleware = function(req,res,next){
    console.log(new Date())
    console.log(req.socket.remoteAddress)
    console.log(req.originalUrl)
    next()
}

module.exports.globalMiddleware=globalMiddleware