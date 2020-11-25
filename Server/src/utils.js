const sql = require('yesql').pg;

export const errorControl = (error, response) => {
   response.send('Error discovered: ' + error);
}

export const wrapSql = (queryString, data) => sql(queryString)(data);

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
