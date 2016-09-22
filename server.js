var express =require('express');
var app = express();
var PORT = process.env.PORT || 4000;

var todos =[{
	id:1,
	name:"Watch",
	description:"watch a movie",
	completed:false
},{
	id:2,
	name:"Learn",
	description:"Learn Angular",
	completed:false
},
{
	id:3,
	name:"Cook",
	description:"Cook Ugali",
	completed:false
}
    
];

app.get('/',function(req,res){
	res.send("Todo Api of its kind");
});

//Get todos Models

/*
  GET /todos
*/
app.get('/todos',function(req,res){
    res.json(todos);
});
//  GET /todos/:id
app.get('/todos/:id',function(req,res){
	var todoID = parseInt(req.params.id,10);
	var matchedTodo;
	//res.send("Sending requested todo with id " + req.params.id);
    todos.forEach(function(todo){
    	if(todoID === todo.id){
    		matchedTodo=todo;
    	}
    });
    if(matchedTodo){
    	res.json(matchedTodo);
    } else{
    	res.status(400).send();
    }
});

app.listen(PORT,function(){
	console.log("Express Server started listens to port " + PORT + "!");
});