const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); 
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname); 
    }
});


const fileFilter = (req, file, cb) => {
   
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || 
        file.mimetype === 'application/pdf' || 
        file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(null, false); 
    }
};


const uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50 
    },
    fileFilter: fileFilter
});

module.exports = uploadFile;
