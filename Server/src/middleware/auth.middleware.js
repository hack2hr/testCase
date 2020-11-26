const jwt = require('jsonwebtoken');
import {getFromConfig} from './../utils';

export default (request, response, next) => {
   if (request.method === 'OPTIONS') {
      return next();
   }

   try {
      const token = request.cookies['token'];

      if (!token) {
         return response.status(401).json({ message: 'Вы не авторизованы' });
      }

      const decoded = jwt.verify(token, getFromConfig('jwtsecret'));
      request.user = decoded;
      next();
   } catch(e) {
      response.status(401).json({ message: 'Вы не авторизованы' });
   }
};
