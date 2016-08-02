var _ = require("underscore");
var db = require('./db.js');
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
	var query_params = req.query;
	var filtered_todos = todos;

	if (query_params.hasOwnProperty("completed") && query_params.completed === "true") {
		filtered_todos = _.where(todos, {
			completed: true
		})
	} else if (query_params.hasOwnProperty("completed") && query_params.completed === "false") {
		filtered_todos = _.where(todos, {
			completed: false
		})
	}

	if (query_params.hasOwnProperty("q") && query_params.q.length > 0) {
		filtered_todos = _.filter(filtered_todos, function(todo) {
			return todo.description.toLowerCase().indexOf(query_params.q.toLowerCase()) > -1;
		})
	}

	res.json(filtered_todos);
});

app.get('/todos/:id', function(req, res) {
	var todoId = +req.params.id;
	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// });

	// if (matchedTodo) {
	// 	res.json(matchedTodo);
	// } else {
	// 	res.status(404).send();
	// }

	db.todo.findById(todoId).then(function(result) {
		if (!!result) {
			res.json(result.toJSON());
		}
		else {
			res.status(404).send();
		}

	}, function(e) {
		res.status(500).send();
	});
});

app.delete('/todos/:id', function(req, res) {
	var todoId = +req.params.id;
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});

	if (matchedTodo) {
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo);
	} else {
		res.status(404).json({
			"Error": "No todo with that ID found"
		});
	}
});

app.post('/todos', function(req, res) {
	var new_todo = req.body;
	var new_todo = _.pick(new_todo, "description", "completed");

	db.todo.create(new_todo).then(function(todo) {
		res.status(200).json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});

	// if (!_.isBoolean(new_todo.completed) || !_.isString(new_todo.description) || new_todo.description.trim().length === 0) {
	// 	return res.status(400).send();
	// }

	// new_todo.description = new_todo.description.trim();

	// new_todo.id = todo_next_id;
	// todos.push(new_todo);
	// todo_next_id++;
	// res.json(new_todo);

});

app.put('/todos/:id', function(req, res) {
	var todo_Id = +req.params.id;
	var matched_todo = _.findWhere(todos, {
		id: todo_Id
	});
	var update_todo = _.pick(req.body, "description", "completed");
	var valid_attributes = {};

	if (!matched_todo) {
		return res.status(404).send();
	}

	if (update_todo.hasOwnProperty("completed") && _.isBoolean(update_todo.completed)) {
		valid_attributes.completed = update_todo.completed;
	} else if (update_todo.hasOwnProperty("completed")) {
		return res.status(400).send();
	}

	if (update_todo.hasOwnProperty("description") && _.isString(update_todo.description) && update_todo.description.trim().length > 0) {
		valid_attributes.description = update_todo.description;
	} else if (update_todo.hasOwnProperty("description")) {
		return res.status(400).send();
	}

	_.extend(matched_todo, valid_attributes);
	res.json(matched_todo);


});


db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("Express listening on port: " + PORT);
	});
})