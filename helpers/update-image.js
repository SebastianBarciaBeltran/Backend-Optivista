// IMPORTS
const fs = require('fs');
//MODELS
const User = require('../models/User');
const Brand = require('../models/Brand');
const Product = require('../models/Product');

// FUNCION PARA ELIMINAR UNA IMG
const deletedImage = ( path ) => {

    if ( fs.existsSync( path ) ) {
        // BORRAMOS LA IMAGEN ANTERIOR
        fs.unlinkSync( path );
    }

}

// FUNCION QUE ACTUALIZA Y ELIMINA LA IMAGEN
const updateImage = async(tipo, id,  nombreArchivo ) => {

    let pathViejo = '';

    switch ( tipo ) {

        case 'users':

            const user =  await User.findById( id );

            if ( !user ) {
                console.log('No es un User por id');
                return false; // SIGNIFICA QUE LA IMAGEN NO SE HA PODIDO SUBIR 
            }

            // EVALUAMOS SI ESE USUARIO TIENE UNA IMAGEN PREVIAMENTE ASIGNADA
            pathViejo =  `./uploads/users/${ user.img }`;
            deletedImage( pathViejo );
            
            user.img = nombreArchivo;
            await user.save();

        break;

        case 'brands':
            const brand =  await Brand.findById( id );

            if ( !brand ) {
                console.log('No es un Brand por id');
                return false; // SIGNIFICA QUE LA IMAGEN NO SE HA PODIDO SUBIR
            }

            // EVALUAMOS SI ESA BRAND TIENE UNA IMAGEN PREVIAMENTE ASIGNADA
            pathViejo =  `./uploads/brands/${ brand.img }`;
            deletedImage( pathViejo );
            
            brand.img = nombreArchivo;
            await brand.save();
            
        break;
        
        case 'products':

            const product =  await Product.findById( id );

            if ( !product ) {
                console.log('No es un Product por id');
                return false; // SIGNIFICA QUE LA IMAGEN NO SE HA PODIDO SUBIR
            }

                    // EVALUAMOS SI ESE PRODUCT TIENE UNA IMAGEN PREVIAMENTE ASIGNADA
            pathViejo =  `./uploads/products/${ product.img }`;
            deletedImage( pathViejo );

            product.img = nombreArchivo;
            await product.save();

            return true;

        break;
    
        default:
        
        break;
    }

    // console.log('vamos bien');

}

// EXPORTAMOS
module.exports = {
    updateImage
}