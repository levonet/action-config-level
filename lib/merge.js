const merge = require('deepmerge')

function mergeLevels(contentLevels, options, log = console) {
    const mergeObject = options.mergeObject || 'deep'
    const mergeArray = options.mergeArray || 'concatenating'
    const mergePlain = options.mergePlain || 'concatenating'

    if (!contentLevels.length) {
        return null
    }

    const contentType = getType(contentLevels)
    if (contentType === null) {
        log.error('The data type isn\'t same or unknown.')
        return null
    }

    let result
    for (const contentLevel of contentLevels) {
        if (typeof result === 'undefined') {
            result = contentLevel
            continue
        }

        if (contentType === 'object') {
            if (mergeObject === 'deep') {
                const options = {}
                if (mergeArray === 'overwrite') {
                    /* eslint no-unused-vars: "off" */
                    options.arrayMerge = (dest, src, options) => src
                }
                result = merge(result, contentLevel, options)
            }
            if (mergeObject === 'overwrite') {
                result = {...result, ...contentLevel}
            }
            if (mergeObject === 'off') {
                result = contentLevel
            }
        }

        if (contentType === 'array') {
            if (mergeArray === 'concatenating') {
                result = result.concat(contentLevel)
            }
            if (mergeArray === 'overwrite') {
                result = contentLevel
            }
        }

        if (contentType === 'plain') {
            if (mergePlain === 'concatenating') {
                result += contentLevel
            }
            if (mergePlain === 'overwrite') {
                result = contentLevel
            }
        }
    }

    return result
}

function getType(contentLevels) {
    let contentType = null

    for (const contentLevel of contentLevels) {
        let currentType

        if (contentLevel instanceof Object) {
            currentType = 'object'
        }
        if (Array.isArray(contentLevel)) {
            currentType = 'array'
        }
        if (typeof contentLevel === 'string') {
            currentType = 'plain'
        }

        if (typeof currentType === 'undefined') {
            return null
        }

        if (contentType === null) {
            contentType = currentType
            continue
        }

        if (contentType !== currentType) {
            return null
        }
    }

    return contentType
}

module.exports = {
    mergeLevels,
    getType
}
