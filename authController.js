const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require ('jsonwebtoken')
const {secret} = require('./config')


const generateAccessToken = (id , roles) =>{
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload , secret , {expiresIn:"24h"})
}



class authController{
    async registration (req , res ){

        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({message:"Ошибка при регистрации", errors: errors.array()})
            }
            

            const{userName , password} = req.body;
            const candidate = await User.findOne({userName});
            if (candidate){
                 return res.status(400).json({message:"Пользователь с таким именем уже существует"})
            }
            const myPlaintextPassword = bcrypt.hashSync(password,7);
            const userRole = await  Role.findOne({value:"USER"})
            const user = new User ({userName, password: myPlaintextPassword , roles:[userRole.value]})
            await user.save()
            return res.json({message:"Пользователь был успешно зарегестрирован"})

        }catch(e){
            console.log(req.body)
            res.status(400).json({message:'regestration error'})
        }
    }

    async  login (req , res ){
        try{
            const{userName , password}= req.body
            const user = await User.findOne({userName})
            if(!user){
                return res.status(400).json({message:"Введен неверный пароль"})  // ✅ Правильно
            }

            const validPassword = await bcrypt.compare(password, user.password)
                if(!validPassword){
                    return req.status(400).json({message:"введен неверный пароль"})
                }
        
                const token = generateAccessToken(user._id , user.roles)
                return res.json({token})

        }catch(e){
           console.log(e)
           res.status(400).json({message:'login error'})
        }
    }

    async getUsers (req , res ){
        try{
            // const users = await User.find()
            const userRole = new Role()
            const adminRole = new Role({value:'ADMIN'})
            await userRole.save()
            await adminRole.save()
            res.json('server work!')
        }catch(e){
           
        }
    }
}

module.exports = new authController()