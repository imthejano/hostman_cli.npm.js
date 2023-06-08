const { program } = require('commander')
const actions = require('./actions')
program
	.version('1.0.0')
	.description(
		'A command line tool for create, read, update and delete hosts for your development projects'
	)

program
	.command('create')
	.option('--y')
	.option('--domain <domain>')
	.option('--ip <ip>')
	.action(async (arg) => await actions.create(arg))

program.command('open').action(async (arg) => await actions.read(arg))
program
	.command('list')
	.option('--all')
	.option('--hostman')
	.option('--others')
	.action(async (arg) => await actions.list(arg))
program
	.command('delete')
	.option('--y')
	.option('--id <id>')
	.action(async (arg) => await actions.remove(arg))
program
	.command('backup')
	.option('--y')
	.option('--open')
	.option('--id <id>')
	.option('--list')
	.option('--restore')
	.action(async (arg) => await actions.backup(arg))
program.command('update').action(async (arg) => await actions.update(arg))

program.parse(process.argv)
