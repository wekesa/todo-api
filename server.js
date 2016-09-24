var express =require('express');
var bodyParser = require('body-parser');
var _=require('underscore');
var app = express();
var PORT = process.env.PORT || 4000;

var todos =[];
var todoNextID =1;

app.use(bodyParser.json());

app.get('/',function(req,res){
	res.send("Todo Api of its kind");
});

//Get todos Models

/*
  GET /todos also filters using query params
*/
app.get('/todos',function(req,res){
	var queryParams = req.query;
	var filterdTodos = todos;
    if(queryParams.hasOwnProperty("completed") && queryParams.completed ==="true"){
       filterdTodos = _.where(filterdTodos,{completed:true});
    }else if(queryParams.hasOwnProperty("completed") && queryParams.completed ==="true"){
    	filterdTodos = _.where(filterdTodos,{completed:false});
    }

    //check for q param
    if(queryParams.hasOwnProperty('q') && queryParams.q.length>0)
    {
    	filterdTodos = _.filter(filterdTodos,function(todo){
           return todo.description.toLowerCase.indexOf(queryParams.q.toLowerCase)>-1;
    	});
    }


    res.json(filterdTodos);
});
//  GET /todos/:id
app.get('/todos/:id',function(req,res){
	var todoID = parseInt(req.params.id,10);
	var matchedTodo  = _.findWhere(todos,{id:todoID});
	//res.send("Sending requested todo with id " + req.params.id);
    if(matchedTodo){
    	res.json(matchedTodo);
    } else{
    	res.status(400).send();
    }
});
/*
*Post requests on he array
*/
app.post('/todos',function(req,res){
    var body = _.pick(req.body,"name","description","completed");

   if(!_.isBoolean(body.completed) || !_.isString(body.name) || 
   	!_.isString(body.description) || body.name.trim().length === 0
   	 || body.description.trim().length ===0){
   	 res.status(400).send();
   }
    body.name=body.name.trim();
    body.description=body.description.trim();
    body.id = todoNextID++;
    todos.push(body);
    console.log("description: " + req.body.description);
    res.json(body);
});



/*
* Deleting an item from an array
*/
app.delete('/todos/:id',function(req,res){
   var deletedtodoID = parseInt(req.params.id,10);
   console.log("Preparing to delete an ited of ID: " + req.body.id);
   var matchedTodo  = _.findWhere(todos,{id:deletedtodoID});
   if(!matchedTodo){
   	   res.status(400).json({"error":"No item found to be deleted"});
   }else{
   	  todos  = _.without(todos,matchedTodo);
      res.json(matchedTodo);
   }
   
});

/*
* Updating an item from an array
*/
app.put('/todos/:id',function(req,res){
	var deletedtodoID = parseInt(req.params.id,10);
    console.log("Preparing to update an item of ID: " + req.body.id);
   var matchedTodo  = _.findWhere(todos,{id:deletedtodoID});

	var body = _.pick(req.body,"name","description","completed");
	var validAttributes ={};
    if(!matchedTodo){
    	res.status(404).json({"error":"Requested ID not found"});
    }

    //validate completed property
	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
        validAttributes.completed = body.completed;
	}else if(body.hasOwnProperty('completed')){
       res.status(400).json({"error":"Type provided for completed is invalid"});
	}
	//validate name property
	if(body.hasOwnProperty('name') && body.name.trim().length > 0){
        validAttributes.name = body.name;
	}else if(body.hasOwnProperty('description')){
       res.status(400).json({"error":"Type provided for name is invalid"});
	}

	//validate description property
	if(body.hasOwnProperty('description') && body.description.trim().length === 0){
        validAttributes.description = body.description;
	}else if(body.hasOwnProperty('description')){
       res.status(400).json({"error":"Type provided for description is invalid"});
	}

	_.extend(matchedTodo,validAttributes);
    res.json(matchedTodo);

})
app.listen(PORT,function(){
	console.log("Express Server started listens to port " + PORT + "!");
});