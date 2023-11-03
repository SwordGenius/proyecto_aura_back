const express = require('express');
const {index, create, getById, updateComplete, delete_logic , updatePartial} = require('../controllers/cliente.controller');
const {fileUpload} = require("../helpers/uploads.helper");
const {verifyAuth} = require("../middlewares/auth.middleware");
const router = express.Router();

router.get('/',  index);
router.post('/',  create);
router.get('/:id', getById);
router.put('/:id', fileUpload, updateComplete);
router.patch('/:id', fileUpload, updatePartial);
router.delete('/:id', delete_logic);

module.exports = router;