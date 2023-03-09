const jwt = require('jsonwebtoken');
const UserModel = require('../../models/UserModel');

function authController(){
    return{
        userLogin(req,res){
            // Validate User Here
            // Then generate JWT Token
            let jwtSecretKey = process.env.JWT_SECRET_KEY;
            let data = {
                time: Date(),
                userId: 12,
            }
        
            const token = jwt.sign(data, jwtSecretKey);
        
            res.send({token:token});
        },
        
        async returnJWTResonseData(req,res){
            const useList = await UserModel.find() 
            res.send({userData:req.headerData,useList:useList});
        },


    }
}

module.exports = authController