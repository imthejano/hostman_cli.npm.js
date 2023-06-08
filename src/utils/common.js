const { prompt } = require('inquirer')
const validator = require('./validator')
const Table = require('cli-table')
const colors = require('colors')
const questions = require('./questions')

const validateDomainInput = async (arg) => {
	let domain = arg.domain ?? ''
	if (!(validator.isFQDN(domain) || validator.isIdentifier(domain))) {
		let answer = await prompt([questions.domainQuestion])
		return answer.domain
	}
	return domain
}
const validateIPInput = async (arg) => {
	let ip = arg.ip ?? ''
	if (!validator.isIP(ip)) {
		let answer = await prompt([questions.ipQuestion])
		return answer.ip
	}
	return ip
}
const validateIdInput = async (arg) => {
	let id = arg.id ?? ''
	if (!validator.isNumber(id)) {
		let answer = await prompt([questions.idQuestion])
		return parseInt(answer.id)
	}
	return parseInt(id)
}
const validateConfirm = async (arg, question) => {
	let confirm = arg.y ?? false
	if (!confirm)
		confirm = (await prompt(questions.confirmQuestion(question.message)))
			.confirm
	return confirm
}

const tableHosts = (hosts) => {
	const table = new Table({
		head: ['id', 'ip', 'domain', 'editable'],
	})
	let hostIndex = 0
	hosts.forEach((host) => {
		if (host.byHostman) hostIndex++
		table.push([
			host.byHostman ? colors.green(hostIndex) : '',
			host.ip,
			colors.blue(host.domain),
			host.byHostman ? colors.green('true') : colors.red('false'),
		])
	})
	return table.toString()
}

const tableBackups = (backups) => {
	const table = new Table({
		head: ['id', 'timestamp', 'file'],
	})
	backups.forEach((backup, backupIndex) => {
		table.push([backupIndex + 1, backup.timestamp, backup.file])
	})
	return table.toString()
}

module.exports = {
	validateDomainInput,
	validateIPInput,
	validateIdInput,
	validateConfirm,
	tableHosts,
	tableBackups,
}
