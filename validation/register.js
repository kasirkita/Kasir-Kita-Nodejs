const validator = require('validator')
const isEmpty = require('../validation/is-empty')

module.exports = function validateRegisterInput(data) {
    let errors = {}

    data.name = !isEmpty(data.name) ? data.name: ''
    data.email = !isEmpty(data.email) ? data.email: ''
    data.password = !isEmpty(data.password) ? data.password: ''
    data.password_confirmation = !isEmpty(data.password_confirmation) ? data.password_confirmation: ''

    if (!validator.isLength(data.name,{min:3, max:50})) {
        errors.name = 'Nama harus antara 3 dan 50 karakter'
    }

    if(validator.isEmpty(data.name)){
        errors.name = "Data nama dibutuhkan";
    }
    
    if(validator.isEmpty(data.email)){
        errors.email = "Data Email dibutuhkan";
    }

    if(!validator.isEmail(data.email)){
        errors.email = "Email tidak valid";
    }

    if(validator.isEmpty(data.password)){
        errors.password = "Data Password dibutuhkan";
    }   

    if(!validator.equals(data.password_confirmation,data.password)){
        errors.password_confirmation = "Data password dan konfirmasi password harus sama";
    }

    if(validator.isEmpty(data.password_confirmation)){
        errors.password_confirmation = "Data Konfirmasi Password dibutuhkan";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }

}