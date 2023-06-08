const validator = require('./validator')

module.exports = {
	domainQuestion: {
		type: 'input',
		name: 'domain',
		message: 'domain: ',
		validate: (input) => validator.isFQDN(input),
	},

	ipQuestion: {
		type: 'input',
		name: 'ip',
		message: 'ip address: ',
		validate: (input) => validator.isIP(input),
	},

	idQuestion: {
		type: 'number',
		name: 'id',
		message: 'id: ',
		validate: (input) => input >= 1,
	},

	confirmQuestion: (message) => {
		return {
			type: 'confirm',
			name: 'confirm',
			message: message,
			default: false,
		}
	},
}
