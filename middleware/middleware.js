const jwt = require('jsonwebtoken');
const {sercret, secret} = require ('../config')

module.exports = function (req , res ,next){
    if (req.method === 'OPTIONS'){
        next()
    }
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.status(403).json({message:"Нет токена"})
        }
        const decodeedData = jwt.verify(token ,secret )
        req.user = decodeedData
        next()

    }catch(e) {
        console.log(e)
        return res.status(403).json({message:"Пользователь не авторизован"})

    }

}