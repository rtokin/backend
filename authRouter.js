const Router = require ('express')
const router = new Router()
const controller = require ('./authController')
const {check} = require('express-validator')
const middlewear = require ("./middleware/middleware")
const roleMiddlewear = require ("./middleware/roleMiddlewear")


router.post('/registration',
    [
        check('userName', "Имя пользователя не может быть пустмы").notEmpty(),
        check('password', "Пароль должен быть больше 4 символов и меньше 10 символов").isLength({min:4,max:10})

    ] ,controller.registration);
router.post('/login', controller.login);
router.get('/users',roleMiddlewear(['USER']), controller.getUsers)

module.exports=router