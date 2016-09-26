var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined,undefined,undefined, {
   'dialect':'sqlite',
   'storage':__dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo',{
   name:{
   	type:Sequelize.STRING
   },
   description:{
   	type:Sequelize.STRING
   },
   completed:{
   	type:Sequelize.BOOLEAN
   }
});

sequelize.sync().then(function(){
	console.log("All stuffs synched");

	Todo.create(
		{
			name:"Watch",
			description: "Watching football",
			completed:true
		}).then(function(todo){
			console.log('Completed');
			console.log(todo);
		});

		Todo.create(
		{
			name:"Study",
			description: "Practise NodeJS",
			completed:false
		}).then(function(todo){
			console.log('Completed');
			console.log(todo);
		});
});