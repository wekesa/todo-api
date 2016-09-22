var express =require('express');
var app = express();
var PORT = process.env.PORT || 4000;

app.get('/',function(req,res){
	res.send("Todo Api of its kind");
});

app.listen(PORT,function(){
	console.log("Express Server started listens to port " + PORT + "!");
});