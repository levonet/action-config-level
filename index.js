const core = require('@actions/core')
const { run } = require('./lib/action')

try {
    run(core)
} catch (error) {
    core.setFailed(error.message)
}
