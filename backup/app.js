var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mysql = require('mysql');
var con = mysql.createConnection({
	host: 'localhost',
	user: 'cole',
	password: 'sHaman2399',
	database: 'equiserv2'
});

server.listen(3001);
console.log("Server started");

app.get('/', function (req, res) {
	console.log("page requested");
 	res.sendfile(__dirname + '/index.html');
});
app.get('/main.js', function (req, res) {
	console.log("page requested");
 	res.sendfile(__dirname + '/main.js');
});
app.get('/jquery.js', function (req, res) {
	console.log("page requested");
 	res.sendfile(__dirname + '/jquery.js');
});
app.get('/jquery.js', function (req, res) {
	console.log("page requested");
 	res.sendfile(__dirname + '/jquery.js');
});

con.connect(function(err){
	if(err) return console.log(err);
	if(!err) console.log("Database Connected");
});

con.query('SELECT * FROM tblSiteExtinguishers WHERE CustSiteID=2415', function(err, rows, fields){
	if(err) throw err;

});

//socket stuff
io.on('connection', function (socket) {
	socket.emit('hello', []);
	socket.on('qUery', function(data){
		if(data[0].length>0){
			var s = "SELECT * FROM "+data[1]+" WHERE "+data[2]+"="+data[0]+" LIMIT "+data[3]+";";
			console.log(s);
			con.query(s, function(err, rows, fields){
				if(err) return console.log(err);
				console.log(rows);
				socket.emit('qUery', [rows, fields]);
			});
		}else{
			con.query("SELECT * FROM "+data[1]+" LIMIT "+data[3]+";", function(err, rows, fields){
				if(err) return console.log(err);
				socket.emit('qUery', [rows, fields]);
			});
		}
	});
});
