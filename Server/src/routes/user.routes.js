const {Router} = require('express');
const jwt = require('jsonwebtoken');
import {db, getFromConfig, wrapResponse, wrapAccess} from '../utils';
import auth from '../middleware/auth.middleware';
const router = Router();

/******************************   ПОЛЬЗОВАТЕЛИ   **********************************/

// /api/user/login
router.get(
   '/login',
   wrapResponse(async (request, response) => {
      const {login, password} = request.query;
      const client = request.client;
      const user = await client.query(
         db.queries.getByFields('users', { login })
      ).then(db.getOne);
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
      const token = request.headers.authorization;
      if (!token) {
         throw 'Пользователь не был автризован';
      }

      const decoded = jwt.verify(token, getFromConfig('jwtsecret'));
      const user_id = decoded.userId;

      const user = await request.client.query(
         db.queries.getByFields('users', { user_id })
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

      const user = await request.client.query(db.queries.insert('users', {
         login, role, password, firstname, lastname, surname, company, department, position
      })).then(db.getOne);

      response.status(201).json({ message: "Пользователь создан", userId: user['user_id'] });
   }));


/******************************   РОЛИ   **********************************/

// /api/user/getAllUserRoles
router.get(
   '/getAllUserRoles',
   wrapAccess(auth, getFromConfig('access.user.getAllUserRoles')),
   wrapResponse(async (request, response) => {
      const roles = await request.client.query(
         db.queries.getByFields('users_roles')
      ).then(db.getOne);

      if (!roles) {
         response.status(400).json({ message: 'Не было найдено ни одной роли' });
      }

      response.json({ roles });
   }));

module.exports = router;
