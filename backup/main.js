var socket = io.connect();

socket.on('hello', function(data){
	console.log('hello recieved');
	$('.info').find("div").remove();
	$('.info').append("<div>info: Hello Recieved</div>");
});
socket.on('error', function(data){
		$('.info').find("br").remove();
		$('.info').find("div").remove();
		$('.info').find("div div").remove();	
		$('.info').append(err);
});
socket.on('qUery', function(data){
		$('.info').find("br").remove();
		$('.info').find("div").remove();
		$('.info').find("div div").remove();	
		data[0].forEach(function(da){
			$('.info').append('<div class="record">');
			var i=0;
			for(var i=0;i<data[1].length;i++){
				$('.info').append("<div>"+data[1][i].name+": "+da[data[1][i].name]+"</div>");
				if(i==(data[1].length-1)){
					$('.info').append('</div><br>');
				}
			}
	});
});
$(document).ready(function(){
	$('#submit').click(function(){
		socket.emit('qUery', [$('#text').val(), $('#table').val(), $('#field').val(), $('#limit').val()]);
	});
	$('#clear').click(function(){
		$('.info').find("br").remove();
		$('.info').find("div").remove();
		$('.info').find("div div").remove();
	});
});

