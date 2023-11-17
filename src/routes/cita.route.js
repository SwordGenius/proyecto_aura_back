const express = require('express');
const {index, create, getById, updateComplete, delete_logic , updatePartial} = require('../controllers/usuario.controller');
const {verifyAuth} = require("../middlewares/auth.middleware");
const router = express.Router();

router.get('/', index);
router.post('/', verifyAuth, create);
router.get('/:id', verifyAuth, getById);
router.put('/:id', verifyAuth, updateComplete);
router.patch('/:id', verifyAuth, updatePartial);
router.delete('/:id', verifyAuth, delete_logic);