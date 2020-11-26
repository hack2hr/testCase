const sql = require('yesql').pg;
var config = require('config');

export const errorControl = (error, response) => {
   response.send('Error discovered: ' + error);
}

export const getFromConfig = (query) => {
   if (config.has(query)) {
       return config.get(query);
   }
   throw new Error(`Error getting "${query}" from config`);
}

// WRAPPERS
export const wrapSql = (queryString, data) => sql(queryString)(data);
export const wrapResponse = (func) => {
   return (request, response, next) => {
      try {
         func(request, response, next);
      } catch (error) {
         response.status(500).json({ message: 'Что-то пошло не так, попробуйте снова', error: e.stack });
      }
   }
};
export const wrapAccess = (func, accessArray) => {
   return (request, response, next) => {
      func(request, response, next, accessArray);
   };
};

// DB HELPERS
export const db = {
   getOne: (result) => result.rows?.[0],
   queries: {
      // SELECT
      getByField: (table, field, value) => {
         const queryString = `SELECT t.* FROM ${table} as t WHERE t.${field} = :${field}`;
         return wrapSql(queryString, { [field]: value });
      },
      // INSERT
      insert: (table, data) => {
         const queryString = `INSERT INTO ${table}(${Object.keys(data).join(', ')}) VALUES (${
            Object.keys(data).map((key) => `:${key}`).join(', ')
         }) RETURNING *`;
         return wrapSql(queryString, data);
      }
   }
};
