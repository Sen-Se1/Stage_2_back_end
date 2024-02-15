const multer = require('multer');
const ApiError = require('../utils/apiError');

const storage = multer.diskStorage({
    destination: './uploads',
});

const fileFilter = (req, file, cb) => {
    // Accept Excel files only
    if (file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        cb(null, true);
    } else {
        cb(new ApiError('Invalid file type. Only Excel files are allowed.', 400), false);
    }
};

const upload = multer({ 
    storage: storage,
    // limits: {
    //     fileSize: 5 * 1024 * 1024
    // },
    fileFilter
}).single('file');

module.exports = { upload };
