module.exports = function(sequelize, data_types) {
	return sequelize.define('user', {
		email: {
			type: data_types.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: data_types.STRING,
			allowNull: false,
			validate: {
				len: [7, 100]
			}
		}
	})
}