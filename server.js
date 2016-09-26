var express =require('express');
var bodyParser = require('body-parser');
var _=require('underscore');
var db = require("./db.js");
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
	var query = req.query;
	var where = {};
    if (query.hasOwnProperty("completed") && query.completed === "true") {
        where.completed = true;

    } else if (query.hasOwnProperty("completed") && query.completed === "false") {
        where.completed = false;
    }

    if (query.hasOwnProperty("q") && query.q.length > 0) {
        where.name = {
            $like: '%' + query.q + '%'
        },
            where.description = {
                $like: '%' + query.q + '%'
            }
    }

    db.todo.findAll({where: where}).then(function (todos) {
        res.json(todos);
    }, function (e) {
        res.status(500).send(e);
    });
});
//  GET /todos/:id
app.get('/todos/:id',function(req,res){
	var todoID = parseInt(req.params.id,10);
	db.todo.findByPrimary(todoID).then(function (todo) {
        if (!!todo) {
            res.json(todo.toJSON());
        } else {
            res.status(400).send();
        }
    }, function (e) {
        res.status(500).send();
    });
});
/*
*Post requests on he array
*/
app.post('/todos',function(req,res){
    var body = _.pick(req.body,"name","description","completed");
   db.todo.create(body).then(function (todo) {
        res.json(todo.toJSON());
    }, function (e) {
        res.status(400).json(e);
    });
});



/*
* Deleting an item from an array
*/
app.delete('/todos/:id',function(req,res){
   var deletedtodoID = parseInt(req.params.id,10);
   console.log("Preparing to delete an item of ID: " + req.body.id);
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

});

db.sequelize.sync().then(function () {
    console.log("Sync the database");

});
app.listen(PORT,function(){
	console.log("Express Server started listens to port " + PORT + "!");
});