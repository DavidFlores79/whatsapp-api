const { Router } = require('express');
const { check } = require('express-validator')
const { getData, postData, updateData, deleteData } = require('../controllers/categories.controller');
const { existCategoryName, validateCategoryById, existUserId } = require('../helpers/db_validators.helper');
const { checkRoleAuth } = require('../middlewares/role-validator.middleware');
const { validarJWT } = require('../middlewares/validar-jwt.middleware');
const { Validator } = require('../middlewares/validator.middleware');
const { checkPermissions } = require('../middlewares/permission-validator.middleware');
const router = Router()

router.get('/', [
    checkPermissions(['VISUALIZAR'])
], getData);
router.post('/',[
    checkPermissions(['CREAR']),
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    checkRoleAuth(['SUPER_ROLE', 'ADMIN_ROLE']),
    check('status', 'El status debe ser de tipo Boolean.').isBoolean(),
    check('name').custom( existCategoryName ),
    Validator
], postData);
router.put('/:id', [
    checkPermissions(['MODIFICAR']),
    check('id', 'No es un id válido.').isMongoId(),
    check('id').custom( validateCategoryById ),
    check('name').custom( existCategoryName ),
    Validator
], updateData);

router.delete('/:id', [
    checkPermissions(['ELIMINAR']),
    validarJWT,
    checkRoleAuth(['SUPER_ROLE', 'ADMIN_ROLE']),
    check('id', 'No es un id válido.').isMongoId(),
    check('id').custom( validateCategoryById ),
    Validator
], deleteData);

module.exports = router