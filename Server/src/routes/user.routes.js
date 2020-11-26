const {Router} = require('express');
// const bcrypt = require('bcryptjs');
// const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
import {db} from '../utils';
const sql = require('yesql').pg;
import auth from '../middleware/auth.middleware';
const router = Router();

// /api/user/add
// router.post(
//    '/add',
//    [auth],
//    async (request, response) => {
//       try {
//          const errors = validationResult(request);
//
//          if (!errors.isEmpty()) {
//             return response.status(400).json({
//                error: errors.array(),
//                message: 'Некорректные данные при регистрации'
//             })
//          }
//
//          const {email, password} = request.body;
//          const candidate = await User.findOne({ email });
//
//          if (candidate) {
//             return response.status(400).json({ message: "Такой пользователь уже существует" });
//          }
//
//          const hashedPassword = await bcrypt.hash(password, 12);
//          const user = new User({ email, password: hashedPassword });
//
//          await user.save();
//
//          response.status(201).json({ message: "Пользователь создан" });
//       } catch(e) {
//          response.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
//       }
//    });

// /api/user/login
router.get(
   '/login',
   async (request, response) => {
      try {
         const {login, password} = request.query;
         const client = request.client;
		 //console.log(login, password)
         const getUserByLogin = sql(
            'SELECT u.* ' +
            'FROM Users as u ' +
            'WHERE u.login = :login')({
            login, password
         });
         const user = await client.query(getUserByLogin).then(db.getOne)
		 //console.log(user)
         if (!user) {
            return response.status(400).json({ message: 'Пользователь не найден' });
         }

         if (password !== user.password) {
            return response.status(400).json({ message: 'Неверный пароль, попробуйте снова' });
         }

         const token = jwt.sign(
            { userId: user.id },
            config.get("jwtsecret"),
            { expiresIn: '1w' }
         );
		 response.cookie('token',token)
         response.json({ token, user: user });
		
      } catch(e) {
         response.status(500).json({ message: 'Что-то пошло не так, попробуйте снова', error: e });
      }
   });
   
router.get(
   '/getUserByToken',
   async (request, response) => {
      try {
         const token = request.cookie('token');
		 console.log(token)
         response.json({ token, token });
		
      } catch(e) {
         response.status(500).json({ message: 'Что-то пошло не так, попробуйте снова', error: e });
      }
 });
module.exports = router;
