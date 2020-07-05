const validator = require('validator')
const isEmpty = require('../validation/is-empty')

module.exports = function validateConfiguration(data) {
    let errors = {}

    data.host = !isEmpty(data.host) ? data.host: ''
    data.port = !isEmpty(data.port) ? data.port: ''

    if(validator.isEmpty(data.host)){
        errors.host = "Data host dibutuhkan";
    }

    if(validator.isEmpty(data.port)){
        errors.port = "Data port dibutuhkan";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}