const express = require('express');
const {index, create, getById, updateComplete, deleteLogic, update, completarCita} = require('../controllers/cita.controller');
const {verifyAuth} = require("../middlewares/auth.middleware");
const router = express.Router();

router.get('/', index);
router.post('/', create);
router.get('/:id', getById);
router.patch('/:id', verifyAuth , update);
router.delete('/:id', verifyAuth, deleteLogic);
router.delete('/completar/:id', verifyAuth, completarCita);

module.exports = router;