// ADD TYPE
const { response } = require('express');
// IMPORTS
const User = require('../models/User');
const bcrypt = require('bcryptjs');
// HERLPERS
const { generateJWT } = require('../helpers/jwt');

// CREAMOS UN NUEVO USUARIO
const SetNewUser = async(req, res = response) => {
    
    const {name, lastName, secondLastName, birthDate, sexo, dni, telephone, email, password, img } = req.body; 

    try {

        // VERIFICAMOS SI EL EMAIL YA EXISTE
        const user = await User.findOne({ email });

        // COMPROBAMOS SI EL USER EXISTE POR EMAIL
        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario ya existe con ese email'
            });
        }

        // CREAR USUARIO CON EL MODELO
        const dbUser = new User( req.body );
        
        // ENCRIPTAR LA CONTRASEÑA
        const salt = bcrypt.genSaltSync(); 
        
        dbUser.password = bcrypt.hashSync( password, salt );
        
        // GENERANDO EL JWT
        const token = await generateJWT( dbUser.id, dbUser.name );

        // CREAMOS EL USER EN LA DB 
        await dbUser.save();

        // GENERAR RESPUESTA EXITOSA
        return res.status(201).json({
            ok: true,
            uid: dbUser.id, 
            name,
            email,
            token
        });

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });        
    }
  

}

// CREAMOS EL LOGIN DE LA APP
const login = async(req, res = response) => {

    const {email, password } = req.body;

    try {

        const dbUser = await  User.findOne( { email });

        if ( !dbUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            }); 
        }
 
        // CONFIRMAMOS SI EL PASSWORD HACE MATCH
        const validPassword = bcrypt.compareSync( password, dbUser.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña es incorrecta'
            }); 
        }
 
        // GENERAMOS EL JWT
        const token = await generateJWT(dbUser.id, dbUser.name, dbUser.email, dbUser.isAdmin);

        // RESPUESTA DEL SERVICIO
        return res.status(200).json({
            ok      : true,
            uid     : dbUser.id, 
            name    : dbUser.name,
            email   : dbUser.email,
            isAdmin : dbUser.isAdmin,
            token
        });

    } catch (error) {
        console.log( error );
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

// RENOVACIÓN DEL TOKEN
const renewToken = async(req, res = response) => {

    const { uid } = req;

    // READ DATABASE
    const dbUser = await User.findById(uid);

    // GENERANDO EL JWT
    const token = await generateJWT( uid, dbUser.name );

    return res.json({
        ok      : true,
        uid,
        name    : dbUser.name,
        email   : dbUser.email,
        isAdmin : dbUser.isAdmin,
        token
    });
}

// OBTENEMOS TODOS LOS USERS
const getUsers = async (req, res = response) => {

    const from = Number(req.query.from) || 0;

    const [ users, total ] = await Promise.all([
        User.find()
                .skip( from ),
                // .limit( 5 ),

        User.count()
    ]);

    res.json({
        ok: true,
        users,
        total
    });

}

// EXPORTAMOS 
module.exports = {
    SetNewUser,
    login,
    renewToken,
    getUsers
}