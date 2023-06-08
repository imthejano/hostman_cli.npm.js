const hostsFullPath = 'C:/Windows/System32/drivers/etc/hosts'
const hostmanPath = process.env.HOME || process.env.USERPROFILE
const hostmanDirName = '.imjano-hostman-cli'
const hostmanFullPath = `${hostmanPath}/${hostmanDirName}`.replace(/\\/g, '/')
const hostmanBackupsPath = `${hostmanFullPath}/backups`
module.exports = {
	hostsFullPath,
	hostmanPath,
	hostmanDirName,
	hostmanFullPath,
	hostmanBackupsPath,
}
