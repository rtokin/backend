const jwt = require('jsonwebtoken');
const {sercret, secret} = require ('../config')


module.exports = function (roles){
    return function (req,res,next){
         if (req.method === 'OPTIONS'){
                next()
            }
            try{
                const token = req.headers.authorization?.split(' ')[1];
                if(!token){
                    return res.status(403).json({message:"Нет токена"})
                }
               const {roles:userRole}=jwt.verify(token , secret)
               let hasRole = false
               userRoles.array.forEach(role => {
                if(roles.includes(role)){
                    hasRole = true 
                }
               });
               if(!hasRole){
                return res.status(403).json({message:"У вас нет доступа"})
               }
            }catch(e) {
                console.log(e)
                return res.status(403).json({message:"Пользователь не авторизован"})
        
            }
    }
}