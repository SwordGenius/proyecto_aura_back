const express = require('express');
const {index, create, getById, updateComplete, delete_logic , updatePartial} = require('../controllers/cliente.controller');
const {fileUpload} = require("../helpers/uploads.helper");
const {verifyAuth} = require("../middlewares/auth.middleware");
const router = express.Router();

router.get('/', verifyAuth, index);
router.post('/', create);
router.get('/:id', verifyAuth, getById);
router.put('/:id', verifyAuth, fileUpload, updateComplete);
router.patch('/:id', verifyAuth, fileUpload, updatePartial);
router.delete('/:id', verifyAuth, delete_logic);

module.exports = router;