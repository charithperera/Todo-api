var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: 'Do groceries',
	completed: false
}, {
	id: 2,
	description: 'Go to lunch',
	completed: false
}, {
	id: 3,
	description: 'Go to gym',
	completed: true
}];

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

app.listen(PORT, function() {
	console.log("Express listening on port: " + PORT);
});