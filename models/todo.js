module.exports = function(sequelize, data_types) {
	return sequelize.define('todo', {
		description: {
			type: data_types.STRING,
			allowNull: false,
			validate: {
				len: [1, 250]
			}
		},
		completed: {
			type: data_types.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	})
};