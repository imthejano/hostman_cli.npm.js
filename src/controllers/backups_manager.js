const fs = require('fs')
const moment = require('moment')

const {
	hostsFullPath,
	hostmanFullPath,
	hostmanBackupsPath,
} = require('../globals')

const openFile = async (backupName) =>
	await fs.readFileSync(`${hostmanBackupsPath}/${backupName}`, 'utf8')

const createBackup = async () => {
	const backupName = `${moment().format('YYYYMMDD_HHmmss')}.backup`
	const existsHostmanDir = await fs.existsSync(`${hostmanBackupsPath}`)
	if (!existsHostmanDir)
		await fs.mkdirSync(`${hostmanBackupsPath}`, { recursive: true })
	await fs.copyFileSync(hostsFullPath, `${hostmanBackupsPath}/${backupName}`)
}
const getBackups = async () => {
	try {
		const existsDir = await fs.existsSync(`${hostmanBackupsPath}`)
		if (!existsDir)
			await fs.mkdirSync(`${hostmanBackupsPath}`, {
				recursive: true,
			})
		const files = await fs.readdirSync(`${hostmanBackupsPath}`)
		const backups = []
		files.forEach((file, fileIndex) => {
			try {
				const timestamp = file.split('.')[0]
				const formatedDateTime = moment(
					timestamp,
					'YYYYMMDD_HHmmss'
				).format('YYYY/MM/DD HH:mm')
				backups.push({
					id: fileIndex + 1,
					timestamp: formatedDateTime,
					file,
				})
			} catch (error) {}
		})
		return backups
	} catch (error) {
		return []
	}
}

module.exports = {
	async createBackup() {
		try {
			await createBackup()
			return true
		} catch (error) {
			return false
		}
	},
	async getBackups() {
		try {
			return await getBackups()
		} catch (error) {
			return []
		}
	},
	async open(arg) {
		try {
			const backups = await getBackups()
			const selectedBackup = backups[arg.id - 1]
			return await openFile(selectedBackup.file)
		} catch (error) {
			return null
		}
	},
	async restoreBackup(arg) {
		try {
			const backups = await getBackups()
			const selectedBackup = backups[arg.id - 1]
			const data = await openFile(selectedBackup.file)
			await fs.writeFileSync(hostsFullPath, data, 'utf8')
		} catch (error) {
			return false
		}
	},
}
