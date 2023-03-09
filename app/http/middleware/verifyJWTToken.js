const jwt = require('jsonwebtoken');

function auth(req, res,next) {
    
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    try {
        console.log(tokenHeaderKey);
        const token = req.header(tokenHeaderKey);
        const verified = jwt.verify(token, jwtSecretKey);
        if(verified){
            console.log(verified);
            req.headerData = verified;
            return next();
        }else{
            // Access Denied
            return res.status(401).send('you are not authorized');
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(error);
    }
}


module.exports = auth;