const validator = require('validator')
const isEmpty = require('../validation/is-empty')

module.exports = function validateLoginInput(data) {
    let errors = {}

    data.name = !isEmpty(data.name) ? data.name: ''
    data.email = !isEmpty(data.email) ? data.email: ''
    data.password = !isEmpty(data.password) ? data.password: ''
    data.password_confirmation = !isEmpty(data.password_confirmation) ? data.password_confirmation: ''

    
    if(validator.isEmpty(data.email)){
        errors.email = "Data Email dibutuhkan";
    }

    if(!validator.isEmail(data.email)){
        errors.email = "Email tidak valid";
    }

    if(validator.isEmpty(data.password)){
        errors.password = "Data Password dibutuhkan";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }

}