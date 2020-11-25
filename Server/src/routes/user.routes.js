const {Router} = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
import {db} from '../utils';
const sql = require('yesql').pg;
import auth from '../middleware/auth.middleware';
const router = Router();

// /api/user/login
router.get(
   '/login',
   async (request, response) => {
      try {
         const {login, password} = request.query;
         const client = request.client;
         const user = await client.query(
            db.queries.getByField('Users', 'login', login)
         ).then(db.getOne);

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

         response.cookie('token', token);
         response.json({ token, user });
      } catch(e) {
         response.status(500).json({ message: 'Что-то пошло не так, попробуйте снова', error: e });
      }
   });

// /api/user/getUserByToken
router.get(
   '/getUserByToken',
   async (request, response) => {
      try {
         const {token} = request.query;
         const decoded = jwt.verify(token, config.get('jwtsecret'));

         const user = await request.client.query(
            db.queries.getByField('Users', 'user_id', decoded.userId)
         ).then(db.getOne);

         if (!user) {
            return response.status(400).json({ message: 'Пользователь не найден' });
         }

         response.json({ user });
      } catch(e) {
         response.status(500).json({ message: 'Что-то пошло не так, попробуйте снова', error: e });
      }
   });

// /api/user/add
router.post(
   '/add',
   auth,
   async (request, response) => {
      try {
         const {
            login, role, password, firstname, lastname, surname, company, department, position
         } = request.body;

         const candidate = await request.client.query(
            db.queries.getByField('Users', 'login', login)
         ).then(db.getOne);

         if (candidate) {
            return response.status(400).json({ message: "Такой пользователь уже существует" });
         }

         const user = await request.client.query(db.queries.insert('Users', {
            login, role, password, firstname, lastname, surname, company, department, position
         })).then(db.getOne);

         response.status(201).json({ message: "Пользователь создан", userId: user['user_id'] });
      } catch(error) {
         response.status(500).json({ message: 'Что-то пошло не так, попробуйте снова', error });
      }
   });


module.exports = router;
