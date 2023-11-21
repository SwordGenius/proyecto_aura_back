const express = require('express');
const {index, create, getById, updateComplete, deleteLogic, update} = require('../controllers/historial.controller');
const {verifyAuth} = require("../middlewares/auth.middleware");
const router = express.Router();

router.get('/', index);
router.post('/', create);
router.get('/:id', getById);
router.patch('/:id', verifyAuth, update);
router.delete('/:id', verifyAuth, deleteLogic);

module.exports = router;