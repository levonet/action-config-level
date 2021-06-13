module.exports = (core) => {
    return {
        info() {
            core.info(...arguments)
        },
        warning() {
            core.warning(...arguments)
        },
        error() {
            core.error(...arguments)
        }
    }
}
