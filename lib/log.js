module.exports = (core) => {
    return {
        info() {
            core.info(...arguments)
        },
        error() {
            core.error(...arguments)
        }
    }
}
