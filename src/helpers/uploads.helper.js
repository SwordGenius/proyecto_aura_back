const path = require('path');
const multer = require('multer');

const diskStorage = multer.diskStorage({
    destination: path.join(__dirname, '../../images'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const fileUpload = multer({
    storage: diskStorage,
}).single('image');

module.exports = {fileUpload}