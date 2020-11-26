const express = require("express");
const {Client} = require('pg');
const http = require('http');
const https = require('https');
import {getFromConfig} from './utils';

 const hostname = '10.0.0.6';
// FOR LOCAL
//const hostname = '127.0.0.1';
const port = 8080;
var client = null;
const app = express();
const saveClient = (req, res, next) => {
    req.client = client;
    next();
};

const ALLOWED_ORIGINS = [
  'http://168.63.58.52:80',
  'http://localhost:63342',
  'http://ksutechrosset.northeurope.cloudapp.azure.com'
]

app.use(function (req, res, next) {
	if(ALLOWED_ORIGINS.indexOf(req.headers.origin) > -1) {
		res.set('Access-Control-Allow-Credentials', 'true')
		res.set('Access-Control-Allow-Origin', req.headers.origin)
	} else { // разрешить другим источникам отправлять неподтвержденные запросы CORS
		res.set('Access-Control-Allow-Origin', '*')        
	}
	
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, x-ijt, include');
 
 
    next();
});

app.use(express.json({ extended: true }));
app.use(saveClient);
app.use('/api/user/', require('./routes/user.routes'));

connectToDataBase();

function connectToDataBase() {
    client = new Client(getFromConfig('postgresql'));
    client.connect();
}

/* MONGO DB TEST CRUD */

// function insertValue(object) {
//     dbo.collection(dgtuCollection).insertOne(myobj, function (err, res) {
//         if (err) throw err;
//         console.log("Document was inserted: ", object)
//     });
// }
//
// function searchOneValue(search) {
//     /*var query = {
//         address: 12
//     };*/
//     dbo.collection(dgtuCollection).find(query).toArray(function (err, result) {
//         if (err) throw err;
//
//         console.log(result);
//         return result;
//     });
// }
//
//
// function deleteValue() {
//     var queryToDelete = {
//         address: 12
//     };
//     dbo.collection(dgtuCollection).deleteOne(queryToDelete, function (err, obj) {
//         if (err) throw err;
//         console.log("1 document deleted");
//         //insertValue();
//         updateValue();
//     });
// }
//
// function updateValue() {
//     var queryOfUpdate = {
//         address: 12
//     };
//     var updatedValue = {
//         $set: {
//             name: "QWERTY",
//             address: 13
//         }
//     };
//     dbo.collection(dgtuCollection).updateOne(queryOfUpdate, updatedValue, function (err, res) {
//         if (err) throw err;
//         //console.log("1 document updated");
//         deleteAllFromCollection();
//     });
// }
//
// function deleteAllFromCollection() {
//     var queryToDelete = {};
//     dbo.collection(dgtuCollection).deleteMany(queryToDelete, function (err, obj) {
//         if (err) throw err;
//         //console.log("All documents deleted");
//
//     });
// }

/* API */
/*среднее время очереди личного кабинета*/
// app.get('/api/user/login', jsonParser, function(request, response) {
//     const {login, password} = request.query;
//     const queryString = sql(
//        'SELECT u.* ' +
//        'FROM Users as u ' +
//        'WHERE u.login = :login AND u.password = :password')({
//         login, password
//     });
//
//     client
//        .query(queryString)
//        .then(res => {
//            response.send(res.rows);
//        })
//        .catch(errorControl);
// });

// app.get("/api/getDiagram", jsonParser, function (request, response) {
//     dbo.collection(dgtuCollection).find({}).toArray(function (err, results) {
//         if (err) throw err;
//         //var address = request.connection.remoteAddress;
//         //if(!address.startsWith('127')){
//         //    console.log('bad request')
//         //}
//         //console.log(request.connection.remoteAddress) //определение ip со стороны клиента
//         //console.log("SELECT VALUE:", results);
//         response.send(results);
//     });
// });
//
// app.post("/api/postURL", jsonParser, function (request, response) {
//     var requestBody = request.body;
// });
//
// app.get("/api/getPrograms", jsonParser, function (request, response) {
//     var query = {
//         item: "Progs"
//     };
//     dbo.collection(dgtuCollection).find(query).toArray(function (err, result) {
//         if (err) throw err;
//
//         //console.log(result);
//         response.send(result);
//     });
// });
//
// app.get("/api/getGraphsFunctions", jsonParser, function (request, response) {
//     var query = {
//         item: "FuncGraphs"
//     };
//     dbo.collection(dgtuCollection).find(query).toArray(function (err, result) {
//         if (err) throw err;
//
//         //console.log(result);
//         response.send(result);
//     });
// });
//
// // TODO fix дубль /api/getAllCompetitions
// app.get("/api/getCompetitionList", jsonParser, function (request, response) {
//     var pks = request.body;
//     var query = {
//         item: "PKs"
//     };
//     dbo.collection(dgtuCollection).find(query).toArray(function (err, result) {
//         if (err) throw err;
//         var list = [];
//         var pksList = result;
//         response.send(pksList);
//
//     });
// });
//
// /*PYTHON EXECUTE*/
// app.post("/api/executePython", jsonParser, function (req, res) {
//     var dataToSend;
//     // spawn new child process to call the python script
//
//     const python = spawn('python', ['../translate.py', req.body.url]);
//     // collect data from script
//     python.stdout.on('data', function (data) {
//         dataToSend = data.toString();
//     });
//     // // in close event we are sure that stream from child process is closed
//     python.on('close', (code) => {
//         console.log(`child process close all stdio with code ${code}`);
//         // send data to browser
//         res.send(dataToSend);
//     });
// });
//
// app.get("/api/getStudents", jsonParser, function (request, response) {
//     var query = {
//         item: "Students"
//     };
//     dbo.collection(dgtuCollection).find(query).toArray(function (err, result) {
//         if (err) throw err;
//
//         //console.log(result);
//         response.send(result);
//     });
// });
//
// // TODO fix дубль /api/getCompetitionList
// app.get("/api/getAllCompetitions", jsonParser, function (request, response) {
//     var query = {
//         item: "PKs"
//     };
//     dbo.collection(dgtuCollection).find(query).toArray(function (err, result) {
//         if (err) throw err;
//
//         //console.log(result);
//         response.send(result);
//     });
// });
//


/*server start */
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
