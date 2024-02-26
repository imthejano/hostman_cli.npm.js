const colors = require('colors')
const hostController = require('./controllers/hosts_manager')
const backupController = require('./controllers/backups_manager')

const {
	validateDomainInput,
	validateIPInput,
	validateIdInput,
	validateConfirm,
	tableHosts,
	tableBackups,
} = require('./utils/common')

module.exports = {
	create: async (arg) => {
		let ip = await validateIPInput(arg)
		let domain = await validateDomainInput(arg)
		const exists = await hostController.findByDomain(domain)
		if (!exists) {
			await hostController.create({ domain, ip })
			let hosts = await hostController.getHosts()
			hosts = hosts.filter((host) => host.byHostman)
			console.log(tableHosts(hosts))
			return true
		}
		if (!exists.byHostman) {
			console.log(
				colors.yellow(
					`The domain that you entered already exists and is currently being used by another software. Therefore, it cannot be replaced using this CLI tool. Please double-check the domain or consider using a different domain that is not currently in use. If you believe there is an error, please contact the software owner or administrator for further assistance.`
				)
			)
			return
		}
		const confirm = await validateConfirm(arg, {
			message: `The domain that you entered already exists and is currently associated with the IP address ${colors.blue(
				ip
			)}. Proceeding will replace the existing IP address with the new one you provide. Are you sure you want to continue and replace the existing IP address?`,
		})
		if (confirm) {
			await hostController.replace({
				oldHost: exists,
				newHost: {
					ip,
					domain,
				},
			})
			let hosts = await hostController.getHosts()
			hosts = hosts.filter((host) => host.byHostman)
			console.log(tableHosts(hosts))
			return true
		}
	},

	read: async (arg) => {
		const data = await hostController.read(arg)
		console.log(data)
	},

	list: async (arg) => {
		let hosts = await hostController.getHosts()
		switch (true) {
			case arg.all:
				break
			case arg.hostman:
				hosts = hosts.filter((host) => host.byHostman)
				break
			case arg.others:
				hosts = hosts.filter((host) => !host.byHostman)
				break
			default:
				hosts = hosts.filter((host) => host.byHostman)
				break
		}
		console.log(tableHosts(hosts))
	},

	remove: async (arg) => {
		let id = await validateIdInput(arg)
		const host = await hostController.findById({ id })
		if (!host)
			return console.log(
				colors.yellow(
					`The host with the provided ID was not found or does not exist in the system. Please double-check the ID and try again. If you believe there is an error, please contact the system administrator for further assistance.`
				)
			)
		const confirm = await validateConfirm(arg, {
			message: `Are you sure you want to delete the host ${colors.yellow(
				host.domain
			)} associated with ${colors.yellow(host.ip)}?`,
		})
		if (confirm) {
			await hostController.remove({ id })
			let hosts = await hostController.getHosts()
			hosts = hosts.filter((host) => host.byHostman)
			console.log(tableHosts(hosts))
		}
	},
	backup: async (arg) => {
		switch (true) {
			case arg.list: {
				const backups = await backupController.getBackups()
				console.log(tableBackups(backups))
				break
			}
			case arg.open: {
				let id = await validateIdInput(arg)
				const data = await backupController.open({ id })
				console.log(data)
				break
			}
			case arg.restore: {
				const confirm = await validateConfirm(arg, {
					message: `Are you sure you want to restore the hosts configuration to a previous version?`,
				})
				if (confirm) {
					let id = await validateIdInput(arg)
					await backupController.restoreBackup({ id })
					console.log(
						colors.green(
							'The hosts file has been successfully restored to a previous version'
						)
					)
				}
				break
			}
			default:
				const confirm = await validateConfirm(arg, {
					message: `Are you sure you want to create a new hosts configuration backup?`,
				})
				if (confirm) {
					if (await backupController.createBackup())
						console.log(
							colors.green(
								'A backup file has been successfully created!'
							)
						)
				}
		}
	},
	async update(arg) {
		const confirm = await validateConfirm(arg, {
			message: `Are you sure you want to update the hosts configuration?`,
		})
		if (confirm) {
			if (await hostController.updateHosts())
				console.log(
					colors.green(
						'The hosts file configuration has been successfully updated.'
					)
				)
		}
	},
}
