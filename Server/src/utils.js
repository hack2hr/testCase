export const errorControl = (error, response) => {
   response.send('Error discovered: ' + error);
}

export const db = {
   getOne: (result) => result.rows?.[0]
};
