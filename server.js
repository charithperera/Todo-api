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
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	}
	else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false
	}

	if ( query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		}
	}

	db.todo.findAll({ where: where }).then(function(result) {
		res.json(result);
	}, function(e) {
		res.status(500).send();
	});

});

app.get('/todos/:id', function(req, res) {
	var todoId = +req.params.id;
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

	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(deleted_count) {
		if (deleted_count === 0) {
			res.status(404).json({
				error: "No todo with provided ID"
			});
		}
		else {
			res.status(204).send();
		}
	}, function(e) {
		res.status(500).send();
	});

});

app.post('/todos', function(req, res) {
	var new_todo = req.body;
	var new_todo = _.pick(new_todo, "description", "completed");

	db.todo.create(new_todo).then(function(todo) {
		res.status(200).json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});

});

app.put('/todos/:id', function(req, res) {
	var todo_Id = +req.params.id;
	var update_todo = _.pick(req.body, "description", "completed");
	var attributes = {};

	if (update_todo.hasOwnProperty("completed")) {
		attributes.completed = update_todo.completed;
	} 

	if (update_todo.hasOwnProperty("description")) {
		attributes.description = update_todo.description;
	} 

	db.todo.findById(todo_Id).then(function(todo) {
		if (todo) {
			todo.update(attributes).then(function(todo) {
				res.json(todo.toJSON());
			}, function(e) {
				res.status(400).json(e);
			});
		}
		else {
			res.status(404).send();
		}
	}, function() {
		res.status(500).send();
	})

});


db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("Express listening on port: " + PORT);
	});
})