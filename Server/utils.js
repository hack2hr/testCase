exports.module = {
   errorControl: function (error, response) {
      response.send('Error discovered: ' + error);
   }
}
