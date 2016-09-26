/**
 * Created by wekesa on 9/25/16.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/data/dev-todo-api.sqlite'
});

var db ={};

db.todo =sequelize.import(__dirname + "/data/models/todo.js");
db.sequelize =sequelize;
db.Sequelize =Sequelize;
module.exports =db;