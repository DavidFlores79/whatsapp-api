const userModel = require('../models/user.model')
const { verifyToken } = require('../helpers/jwt.helper')
const permissionModel = require('../models/permission.model')
const module_permission_roleModel = require('../models/module_permission_role.model')

const checkPermissions = ( permissions ) => async (req, res, next) => {

    try {
       
        if(!req.headers.authorization) {
            return res.status(401).send({msg: 'No existe el token del Usuario'})
        }
        const token = req.headers.authorization.split(' ').pop()
        const tokenData = await verifyToken (token);
        const url = req.baseUrl.split('/'); //toma el ultimo tramo de la ruta base para validar los permisos en dicha ruta
        const route = url.pop()+'';
        // console.log('mis datos de ruta: ', req);
        // console.log('mi ruta', route);

        if(!tokenData) {
            return res.status(401).send({msg: 'Token no válido. **'}) //Si el token no es valido debera ser redirigido a Home
        }
        const userData = await userModel.findById(tokenData._id);

        const menu = await getUserMenu( userData.role );
        let result = menu.find(menu => menu.name === route); //Busca en el array de rutas del usuario si esta incluido ahi dicha ruta
        console.log('ruta y permisos: ', result);

        if(!result) {
            console.log(`Perfil ${userData.role} no autorizado para la ruta ${req.baseUrl}`);
            return res.status(403).send({msg: 'No tiene permisos para Visualizar.'})
        }


        const isAllowed =  result.permissions.some( ai => permissions.includes(ai) );
        console.log(isAllowed);

        if(isAllowed) {
            next();
        } else {
            console.log(`Perfil ${userData.role} no autorizado para la ruta ${req.baseUrl}`);
            return res.status(401).send({msg: `${permissions} - Perfil de Usuario No Autorizado.`})
        }

    } catch (error) {
        console.log(`Error al obtener el Perfil de Usuario para la ruta ${req.baseUrl}. ${error}`);
        return res.status(500).send({msg: 'Error al obtener el Perfil de Usuario.'})
    }

}

module.exports = { checkPermissions}