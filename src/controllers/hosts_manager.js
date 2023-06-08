const validator = require('../utils/validator')
const fs = require('fs')
const { execSync } = require('child_process')

const { hostsFullPath } = require('../globals')

const startLine = '#added by hostman start'
const endLine = '#added by hostman end'

const openFile = async () => await fs.readFileSync(hostsFullPath, 'utf8')
const getLines = async () => {
	const data = await openFile()
	let lines = data.split(/\r?\n/)
	lines = lines.map((line) => line.trimStart())
	return lines
}

const getHosts = async () => {
	const lines = await getLines()
	let byHostman = false
	const result = []
	lines.forEach((line) => {
		if (line.startsWith(startLine)) byHostman = true
		if (!line.startsWith('#')) {
			const [ip, domain] = line.split(/\s+/)
			if (
				validator.isIP(ip ?? '') &&
				(validator.isFQDN(domain ?? '') ||
					validator.isIdentifier(domain ?? ''))
			)
				result.push({ ip, domain, byHostman })
		}
		if (line.startsWith(endLine)) byHostman = false
	})
	return result
}

const isHostmanSection = async () => {
	const lines = await getLines()
	return lines.includes(startLine)
}
const setHostmanSection = async () =>
	await fs.appendFileSync(hostsFullPath, `\n${startLine}\n${endLine}`)

module.exports = {
	async read() {
		try {
			const data = await openFile()
			return data
		} catch (error) {
			return null
		}
	},
	async getHosts() {
		try {
			return await getHosts()
		} catch (error) {
			return []
		}
	},

	async create(arg) {
		try {
			if (!(await isHostmanSection())) await setHostmanSection()
			let lines = await getLines()
			const hostmanSectionIndex = lines.findIndex((line) =>
				line.includes(startLine)
			)
			if (hostmanSectionIndex === -1) return false
			lines.splice(
				hostmanSectionIndex + 1,
				0,
				`${arg.ip}\t\t${arg.domain}`
			)
			await fs.writeFileSync(hostsFullPath, lines.join('\n'))
			return true
		} catch (error) {
			return false
		}
	},

	async findByDomain(domain) {
		try {
			const hosts = await getHosts()
			return hosts.find((host) => host.domain == domain)
		} catch (error) {
			return null
		}
	},

	async findById(arg) {
		try {
			if (arg.id < 1) return null
			let hosts = await getHosts()
			hosts = hosts.filter((host) => host.byHostman)
			return hosts[arg.id - 1]
		} catch (error) {
			return null
		}
	},

	async replace(arg) {
		try {
			const lines = await getLines()
			const lineIndex = lines.findIndex(
				(line) =>
					line.includes(arg.oldHost.domain) &&
					line.includes(arg.oldHost.ip)
			)
			if (lineIndex === -1) return false
			lines.splice(
				lineIndex,
				1,
				`${arg.newHost.ip}\t\t${arg.newHost.domain}`
			)
			await fs.writeFileSync(hostsFullPath, lines.join('\n'))
			return true
		} catch (error) {
			return false
		}
	},

	async remove(arg) {
		try {
			if (arg.id < 1) return false
			let hosts = await getHosts()
			hosts = hosts.filter((host) => host.byHostman)
			if (hosts.length < arg.id) return false
			const lines = await getLines()
			const startingLine = lines.findIndex((line) =>
				line.startsWith(startLine)
			)
			lines.splice(startingLine + arg.id, 1)
			await fs.writeFileSync(hostsFullPath, lines.join('\n'))
			return true
		} catch (error) {
			return false
		}
	},

	async updateHosts() {
		try {
			await execSync('ipconfig /flushdns')
			return true
		} catch (error) {
			console.log(error)
			return false
		}
	},
}
