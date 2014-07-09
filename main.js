var socket = io.connect();

//initiates connection
socket.on('hello', function(data){
	console.log('hello recieved');
});
//get the tables when database is connected
socket.on('tables', function(data){
	console.log(data[0]);
	console.log(data[1]);
	$('#table').find("option").remove();
	data[0].forEach(function(da){
		var i=0;
		for(var i=0;i<data[1].length;i++){
			$('#table').append("<option value='"+da[data[1][i].name]+"'>"+da[data[1][i].name]+"</option>");
		}
	});
	socket.emit('fields', data[0][0][data[1][0].name]);
});
//get the fields
socket.on('fields', function(data){
	$('#field').find("option").remove();
	$('#sort').find("option").remove();
	for(var i=0;i<data[1].length;i++){
			$('#field').append("<option value='"+data[1][i].name+"'>"+data[1][i].name+"</option>");
			$('#sort').append("<option value='"+data[1][i].name+"'>"+data[1][i].name+"</option>");
	}
});
//query the database
socket.on('qUery', function(data){
		$('.info').val("");
		$('.info').find("br").remove();
		$('.info').find("tr").remove();
		$('.info').find("tr td").remove();
		$('.info').find("div").remove();
		console.log(data);
		data[0].forEach(function(da){
			var i=0;
			for(var i=0;i<data[1].length;i++){
				$('.info').append("<tr><td><span style='font-weight: 600'>"+data[1][i].name+": </span></td><td>"+da[data[1][i].name]+"</td></tr>");
				if(i==(data[1].length-1)){
					$('.info').append('<div class="sep" style="border-bottom: 1px solid grey;margin-top: 30px;"></div><br>');
					console.log("this");
				}
			}
	});
});
$(document).ready(function(){
	//when connect button clicked attempt to connect with parameters provided
	$('#con').click(function(){
		socket.emit('connEct', [$('#loc').val(),$('#user').val(), $('#pass').val(), $('#data').val()]);
	});
	//when disconnect button clicked disconnect database(caution: buggy)
	$('#dis').click(function(){
		console.log("ending connection");
		socket.emit('dis');
	});
	//at anytime or place press 'enter' to execute query
	$(document).keypress(function(event){
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode == '13'){
			socket.emit('qUery', [$('#text').val(), $('#table').val(), $('#field').val(), $('#limit').val(), $('#sort').val(), $('#cending').val()]);
		}
	});
	// delete all query info and show information to user in box
	socket.on('info', function(data){
	$('adding info: '+data);
	$('.info').find("div").remove();
	$('.info').append("<div>info: "+data+"</div>");
	});
	//when typing actoumatically query(like google instant) delete this if your queries are slow
	$('#text').keyup(function(){
		if($('#instant').val()=='on'){
			socket.emit('qUery', [$('#text').val(), $('#table').val(), $('#field').val(), $('#limit').val(), $('#sort').val(), $('#cending').val()]);
		}
	});
	//change the table
	$('#table').change(function(){
		socket.emit('fields', $('#table').val());
	});
	//sort the query differently
	$('#sort').change(function(){
		socket.emit('qUery', [$('#text').val(), $('#table').val(), $('#field').val(), $('#limit').val(), $('#sort').val(), $('#cending').val()]);
	});
	//change ascending or descding
	$('#cending').change(function(){
		socket.emit('qUery', [$('#text').val(), $('#table').val(), $('#field').val(), $('#limit').val(), $('#sort').val(), $('#cending').val()]);
	});
	//submit button as alternitize means of getting the query
	$('#submit').click(function(){
		socket.emit('qUery', [$('#text').val(), $('#table').val(), $('#field').val(), $('#limit').val(), $('#sort').val(), $('#cending').val()]);
	});
	//clears the info page
	$('#clear').click(function(){
		$('.info').val("");
		$('.info').find("br").remove();
		$('.info').find("tr").remove();
		$('.info').find("tr td").remove();
		$('.info').find("div").remove();
	});
});

