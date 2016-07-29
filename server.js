var express = require("express");
var body_parser = require("body-parser");
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todo_next_id = 1;

app.use(body_parser.json());

app.get('/', function(req, res) {
	res.send('To do API root');
});

app.get('/todos', function(req, res) {
	res.json(todos);
});

app.get('/todos/:id', function(req, res) {
	var todoId = req.params.id;
	var matchedTodo;

	todos.forEach(function(td) {
		if (td.id === +todoId) {
			matchedTodo = td;
		};
	});

	if (matchedTodo) {
		res.json(matchedTodo);
	}
	else {
		res.status(404).send();
	}	
});

app.post('/todos', function(req, res) {
	var new_todo = req.body;
	new_todo.id = todo_next_id;
	todos.push(new_todo);
	todo_next_id++;
	res.json(new_todo);
});

app.listen(PORT, function() {
	console.log("Express listening on port: " + PORT);
});