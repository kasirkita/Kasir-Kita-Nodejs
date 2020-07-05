const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const TokenGenerator = require('uuid-token-generator')
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')
const permissions = require('../../seeder/data.json')
const Permission = require('../../models/Permission')
const Role = require('../../models/Role')
const Setting = require('../../models/Setting')
const _ = require('underscore')
var Storage = require('node-storage');
const store = new Storage('../../config/database')

router.post('/register', async (req, res) => {



    const { errors, isValid } = validateRegisterInput(req.body)

    if (!isValid) {
        return res.status(400).json(errors)
    }

    await Promise.all(permissions.permissions.data.map(async (permission) => {

        const newPermission = await new Permission({
            name: permission.name,
            slug: permission.slug,
            icon: permission.icon
        })
            .save()
            .then(permission => permission)
            .catch(err => {
                return res.status(500).json({
                    message: err
                })
            })

        if (permission.children && permission.children.length > 1) {

            permission.children.map(async (child) => {

                await new Permission({
                    name: child.name,
                    slug: child.slug,
                    parent: newPermission._id
                })
                    .save()
                    .then(child => child)
                    .catch(err => {
                        return res.status(500).json({
                            message: err
                        })
                    })
            })
        }

    }))


    const dataPermission = await Permission.find()
    const getPermission = await Permission.aggregate([
        { "$match": { "parent" : null }},
        {
            "$lookup": {
                "from": "permissions",
                "localField": "_id",
                "foreignField": "parent",
                "as": "children"
            }
        }
    ])
    
    const newRole = await new Role({
        name: 'Admin',
        permissions: dataPermission.map(rolePermission => {
            return {
                permission: rolePermission._id,
                allow: true
            }
        })
    })
    .save()
    .then(role => role)
    .catch(err => {
        return res.status(500).json({
            message: err
        })
    })

    const newSetting = await new Setting({
        name: 'Kasir Kita',
        address: 'Jl. Sukaduka No 19 Kec. Sukasuka Kab Sukamakmur \n Karawang',
        thousand_separator: ',',
        decimal_separator: '.',
        logo_remove: false,
        phone_number: '081234567890',
        divider: '-',
        currency: 'Rp',
        tax: 0,
        footer: 'Terimakasih telah berbelanja \n dibuat oleh kasir kita'
    })
    .save()
    .then(setting => setting)
    .catch(err => {
        return res.status(500).json({
            message: err
        })
    })

    const findUser = await User.findOne({ email: req.body.email })
                        .then(user => user)
                        .catch(err => {
                            return res.status('500').json({
                                message: err
                            })
                        })
    
    if (findUser) {
        return res.status('400').json({ email: 'Alamat email sudah digunakan' })
    } else {

        const tokgen = new TokenGenerator(256, TokenGenerator.BASE62)
        const token = tokgen.generate()
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            token,
            role: newRole._id
        })

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password,salt,(err,hash) => {
                if(err) throw err
                newUser.password = hash
                newUser.save()
                    .then(user => {
                        
                        const rolePermission = newRole.permissions
                        const isPermissionAllowed = _.where(rolePermission, {allow: true})
                        const permissionId = _.pluck(isPermissionAllowed, 'permission')

                        const permissionAllowed = _.map(getPermission, permission => {
                            
                            if (_.contains(_.map(permissionId, Ids => Ids.toString()), permission._id.toString())) {

                                const childrenAllowed = _.map(permission.children && permission.children.length > 0 && permission.children, children => {
                                    if (_.contains(_.map(permissionId, Ids => Ids.toString()), children._id.toString())) {
                                        return {
                                            _id: children._id,
                                            name: children.name,
                                            slug: children.slug,        
                                        }
                                    }
                                })

                                return {
                                    _id: permission._id,
                                    name: permission.name,
                                    slug: permission.slug,
                                    icon: permission.icon,
                                    children: childrenAllowed
                                }
                                
                            }
                            
                        }).filter(x => x)

                        res.json({
                            message: 'Register berhasil',
                            data: user,
                            permissions: permissionAllowed,
                            token,
                            redirect: _.first(permissionAllowed),
                            settings: newSetting
                        })

                    })
                    .catch(err => {
                        return res.status('500').json({
                            message: err
                        })
                    })
            })
        })
    }    

})


router.get('/check', async (req, res) => {

    const isExists = await store.get('database')

    if (isExists) {

        User.findOne({}).then(user => {
            return res.json({
                user_exists: user ? true : false,
                database_exists: isExists
            })
        })

    } else {
        return res.json({
            user_exists: false,
            database_exists: false
        })
    }

})


router.get('/test', (req, res) => {
    return res.json({
        message: 'Berhasil terhubung'
    })
})

router.post('/login', async (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body)

    if (!isValid) {
        return res.status(400).json(errors)
    }

    const tokgen = new TokenGenerator(256, TokenGenerator.BASE62)
    const token = tokgen.generate()

    const findUser = await User.findOneAndUpdate({email: req.body.email}, {
                                token: token
                            })
                            .populate('role')
                            .populate('user')
                            .then(user => user)
                            .catch(err => {
                                return res.status(500).json({
                                    message: err
                                })
                            })
    if (findUser) {

        bcrypt.compare(req.body.password, findUser.password).then(async result => {
            if (result) {

                const settings = await Setting.findOne()
                const rolePermission = findUser.role.permissions
                const permissions = await Permission.aggregate([
                                        { "$match": { "parent" : null }},
                                        {
                                            "$lookup": {
                                                "from": "permissions",
                                                "localField": "_id",
                                                "foreignField": "parent",
                                                "as": "children"
                                            }
                                        }
                                    ])

                const isPermissionAllowed = _.where(rolePermission, {allow: true})
                const permissionId = _.pluck(isPermissionAllowed, 'permission')

                const permissionAllowed = _.map(permissions, permission => {
                    
                    if (_.contains(_.map(permissionId, Ids => Ids.toString()), permission._id.toString())) {

                        const childrenAllowed = _.map(permission.children && permission.children.length > 0 && permission.children, children => {
                            if (_.contains(_.map(permissionId, Ids => Ids.toString()), children._id.toString())) {
                                return {
                                    _id: children._id,
                                    name: children.name,
                                    slug: children.slug,        
                                }
                            }
                        })

                        return {
                            _id: permission._id,
                            name: permission.name,
                            slug: permission.slug,
                            icon: permission.icon,
                            children: childrenAllowed
                        }
                        
                    }
                    
                }).filter(x => x)

                res.json({
                    message: 'Login berhasil',
                    data: findUser,
                    permissions: permissionAllowed,
                    token,
                    redirect: _.first(permissionAllowed),
                    settings
                })

            } else {
                res.status(400).json({
                    password: 'Password anda salah'
                })
            }
        }).catch(err => {
            return res.status(500).json({
                message: err
            })
        })

    } else {
        res.status(400).json({
            email: 'Email tidak ditemukan'
        })
    }
})

module.exports = router