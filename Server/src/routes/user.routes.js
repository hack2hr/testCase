const {Router} = require('express');
const jwt = require('jsonwebtoken');
import {db, getFromConfig, wrapResponse, wrapAccess} from '../utils';
import auth from '../middleware/auth.middleware';
const router = Router();

// /api/user/login
router.get(
   '/login',
   wrapResponse(async (request, response) => {
      const {login, password} = request.query;
      const client = request.client;
      const user = await client.query(
         db.queries.getByFields('Users', { login })
      ).then(db.getOne);
		 //console.log(user)
      if (!user) {
         return response.status(400).json({ message: 'Пользователь не найден' });
      }

      if (password !== user.password) {
         return response.status(400).json({ message: 'Неверный пароль, попробуйте снова' });
      }

      const token = jwt.sign(
         {
            userId: user.user_id,
            role: user.role
         },
         getFromConfig("jwtsecret"),
         { expiresIn: '1w' }
      );

      response.cookie('token', token);
		
      response.json({ token, user });
   }));

// /api/user/getUserByToken
router.get(
   '/getUserByToken',
   wrapResponse(async (request, response) => {
      const {token} = request.query;
      const decoded = jwt.verify(token, getFromConfig('jwtsecret'));
      const user_id = decoded.userId;

      const user = await request.client.query(
         db.queries.getByFields('Users', { user_id })
      ).then(db.getOne);

      if (!user) {
         return response.status(400).json({ message: 'Пользователь не найден' });
      }

      response.json({ user });
   }));

// /api/user/add
router.post(
   '/add',
   wrapAccess(auth, getFromConfig('access.user.add')),
   wrapResponse(async (request, response) => {
      const {
         login, role, password, firstname, lastname, surname, company, department, position
      } = request.body;

      const candidate = await request.client.query(
         db.queries.getByFields('Users', { login })
      ).then(db.getOne);

      if (candidate) {
         return response.status(400).json({ message: "Такой пользователь уже существует" });
      }

      const user = await request.client.query(db.queries.insert('Users', {
         login, role, password, firstname, lastname, surname, company, department, position
      })).then(db.getOne);

      response.status(201).json({ message: "Пользователь создан", userId: user['user_id'] });
   }));

   
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
