import multer from 'multer';
import appRoot from 'app-root-path';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log('appRoot')
        cb(null, appRoot + "/src/uploads");
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        // console.log(file.name, 'name')
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = function (req, file, cb) {
    // console.log('iageFilter')
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter });

export default upload;