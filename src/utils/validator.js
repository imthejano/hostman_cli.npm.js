module.exports = {
	isIP(str) {
		const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/
		const ipv6Regex = /^([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}$/
		return ipv4Regex.test(str) || ipv6Regex.test(str)
	},

	isFQDN(str) {
		const fqdnRegex =
			/^(?=.{1,255}$)(([a-zA-Z0-9][a-zA-Z0-9-_]{0,61}[a-zA-Z0-9]\.)+[a-zA-Z]{2,})$/
		return fqdnRegex.test(str)
	},
	isIdentifier(str) {
		const wordRegex = /^[a-zA-Z][a-zA-Z0-9]*$/
		return wordRegex.test(str)
	},
	isNumber(value) {
		return /^\d+$/.test(value)
	},
}
