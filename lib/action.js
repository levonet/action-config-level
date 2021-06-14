const logWrapper = require('./log')
const { getFiles, getLevels } = require('./levels')
const { getType, mergeLevels } = require('./merge')

function configLevels(patterns, options, log = console) {
    const files = getFiles(patterns)
    const levels = getLevels(files, log)

    return mergeLevels(levels, options, log)
}

function run(core) {
    const log = logWrapper(core)
    const patterns = core.getInput('patterns', {required: true})
    const outputProperties = core.getInput('output_properties')
    const options = {
        mergeObject: core.getInput('merge_object'),
        mergeArray: core.getInput('merge_array'),
        mergePlain: core.getInput('merge_plain')
    }

    if (!(['deep', 'overwrite', 'off'].includes(options.mergeObject))) {
        core.error(`Wrong value of "merge_object": "${options.mergeObject}". Sould be one of "deep", "overwrite" or "off".`)
        return
    }
    if (!(['concatenating', 'overwrite'].includes(options.mergeArray))) {
        core.error(`Wrong value of "merge_array": "${options.mergeArray}". Sould be one of "concatenating" or "overwrite".`)
        return
    }
    if (!(['concatenating', 'overwrite'].includes(options.mergePlain))) {
        core.error(`Wrong value of "merge_plain": "${options.mergePlain}". Sould be one of "concatenating" or "overwrite".`)
        return
    }

    const result = configLevels(patterns, options, log)
    if (result === null) {
        core.info('Nothing to output.')
        return
    }

    const resultType = getType([result])
    core.info(`resultType = "${resultType}"`)
    core.info(`outputProperties = "${outputProperties}"`)
    if (outputProperties === 'true' && resultType === 'object') {
        for (const [key, value] of Object.entries(result)) {
            const outputKey = key.replace(/[^\w_-]+/gu, '_')
            if (outputKey.match(/^[a-zA-Z_]/u) === null) {
                core.warning(`Can't set output key "${outputKey}". Name of output key must start with a letter or _.`)
                continue
            }

            let outputValue = value
            if (typeof value !== 'string') {
                outputValue = JSON.stringify(value)
            }

            core.info(`Set output key "${outputKey}" to "${outputValue}"`)
            core.setOutput(outputKey, outputValue)
        }
    }

    core.info('Set output result.')
    core.setOutput('result', JSON.stringify(result))
}

module.exports = {
    configLevels,
    run
}
