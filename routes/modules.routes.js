const { Router } = require('express');
const { check } = require('express-validator')
const { getData, postData, updateData, deleteData } = require('../controllers/modules.controller');
const { validateRoute, validateModuleById } = require('../helpers/db_validators.helper');
const checkRoleAuth = require('../middlewares/role-validator.middleware');
const { validarJWT } = require('../middlewares/validar-jwt.middleware');
const { Validator } = require('../middlewares/validator.middleware');
const router = Router()

router.get('/', getData);
router.post('/',[
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    check('route', 'La Ruta es obligatoria.').not().isEmpty(),
        
    //Validacion personalizada que usa el modelo roles
    check('route').custom( validateRoute ),
    
    Validator
], postData);
router.put('/:id', [
    check('id', 'No es un id válido.').isMongoId(),
    check('id').custom( validateModuleById ),
    check('route').custom( validateRoute ),
    Validator
], updateData);

router.delete('/:id', [
    validarJWT,
    checkRoleAuth(['SUPER_ROLE', 'ADMIN_ROLE']),
    check('id', 'No es un id válido.').isMongoId(),
    check('id').custom( validateModuleById ),
], deleteData);

module.exports = router