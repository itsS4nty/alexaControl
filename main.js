/*jshint esversion: 6 */
const requestSync = require('syncrequest');
const conexion  = require('./conexion');
const fs = require("fs");
var msql = require("mssql");
//server.js
var path = require('path');
var express = require('express');
var app = express();
var session = require('express-session');
app.set('view-engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public/'));
app.use(session({
  secret: 'HitSystems',
  resave: true,
  saveUninitialized: true
}));
var auth = function(req, res, next) {
  if (req.session.admin)
    return next();
  else
    return res.redirect('/login');
};
const dataSecret = fs.readFileSync('data.json');
var content = JSON.parse(dataSecret);
var config =
  {
    user: content.user,
    password: content.password,
    server: content.server,
    database: content.database
  };
app.get('/', auth, (req, res) => {
  res.render('index.ejs');
});
app.get('/login', (req, res) => {
  res.render('login.ejs');
});
app.post('/login', (req, res) => {
  var user = req.body.user;
  var passwd = req.body.passwd;
  var sql = `select count(*) from dependentes de join dependentesExtes ex on ex.id = de.codi and ex.nom = 'PASSWORD' where (de.memo = '${user}' or de.nom = '${user}_WEB') and ex.valor = '${passwd}'`;
  msql.connect(config, err => {
      const request = new msql.Request()
      request.stream = true
      request.query(sql)
      request.on('row', row => {
        if(row[''] == 1) {
          req.session.admin = true;
          res.redirect('/');
        }
      })
  })
  
});
const server = app.listen(app.get('port'), () => {
  console.log('Server on port', app.get('port'));
});

var io = require('socket.io')(server);
io.on('connection', function (socket){
  console.log('connection');
  var sql = "select * from alexa";
  conexion.recHit("hit", sql).then(data => {
        socket.emit('data', data);
  })
  socket.on('empresa', function(data) {
    var alexaid = data.alexaid;
    var empresa = data.empresa;
    sql = `update alexa set empresa = '${empresa}' where alexaId = '${alexaid}'`;
    conexion.recHit('hit', sql);
  });
  socket.on('licencia', function(data) {
      var alexaid = data.alexaid;
      var lic = data.licencia;
      sql = `update alexa set llicencia = '${lic}' where alexaId = '${alexaid}'`;
      conexion.recHit('hit', sql);
  });
});
