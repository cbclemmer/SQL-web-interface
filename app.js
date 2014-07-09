var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mysql = require('mysql');
var con;
server.listen(3001);
console.log("Server started");

//express get pages
app.get('/', function (req, res) {
	console.log("page requested");
 	res.sendfile(__dirname + '/index.html');
});
app.get('/main.css', function (req, res) {
 	res.sendfile(__dirname + '/main.css');
});
app.get('/main.js', function (req, res) {
 	res.sendfile(__dirname + '/main.js');
});
app.get('/jquery.js', function (req, res) {
 	res.sendfile(__dirname + '/jquery.js');
});
app.get('/jquery.js', function (req, res) {
 	res.sendfile(__dirname + '/jquery.js');
});

//socket stuff
io.on('connection', function (socket) {
	//when connection button is pressed connect with data provided
	socket.on('connEct', function(data){
		con = mysql.createConnection({
			host: data[0],
			user: data[1],
			password: data[2],
			database: data[3]
		});
		//connect
		con.connect(function(err){
			if(err) return socket.emit('info', 'something went wrong');
			if(!err) socket.emit('info', 'Connected');
		});
		//show the tables
		con.query('SHOW TABLES', function(err, rows, fields){
			if(err) return console.log(err);
			socket.emit('tables', [rows, fields]);
		});
	});
	//when disconnect button pressed (bug: it will not inform user when disconnected after you query database once but it is disconnecting
	socket.on('dis', function(data){
		if(con){
			con.destroy();
			console.log('disconnecting');
			socket.emit('info', 'disconnected');
		}else{
			//have not had this one come up yet
			socket.emit('info', 'cannot find connection');
		}
	});
	//initial hello to client
	socket.emit('hello', []);
	//add fields to field input box
	socket.on('fields', function(data){
		console.log("changing");
		con.query("SELECT * FROM "+data+" LIMIT 1", function(err, rows, fields){
			if(err) return console.log(err);
			socket.emit('fields', [rows, fields]);
		});
	});
	//queries
	socket.on('qUery', function(data){
		if(data[0].length>0){
			var s = "SELECT * FROM "+data[1]+" WHERE "+data[2]+" LIKE '%"+data[0]+"%' ORDER BY "+data[4]+" "+data[5]+" LIMIT "+data[3]+";";
			console.log(s);
			con.query(s, function(err, rows, fields){
				if(err) return console.log(err);
				socket.emit('qUery', [rows, fields]);
			});
		}else{
			var s = "SELECT * FROM "+data[1]+" ORDER BY "+data[4]+" "+data[5]+" LIMIT "+data[3]+";";
			console.log(s);
			con.query(s, function(err, rows, fields){
				if(err) return console.log(err);
				socket.emit('qUery', [rows, fields]);
			});
		}
	});
	//on tab close disconnect database
	socket.on('disconnect', function () {
		con.destroy();
		console.log("disconnecting");
	});
});
