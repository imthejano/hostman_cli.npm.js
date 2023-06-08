module.exports = {
	isIP(str) {
		const ipRegex =
			/^(?:(?:\d{1,3}\.){3}\d{1,3}|(?:(?:::)?(?:[a-fA-F0-9]{1,4}(?::|$)){1,8}))(?::\d{1,5})?$/
		return ipRegex.test(str)
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
