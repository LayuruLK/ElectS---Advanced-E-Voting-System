const multer = require('multer');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

// File filter (Allow JPEG, PNG, and PDF)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type. Allowed: JPEG, PNG, PDF'), false);
    }
};

// Multer upload setup
const upload = multer({
    storage: storage,
    //limits: { fileSize: 1024 * 1024 * 10 }, // 10MB limit
    fileFilter: fileFilter
});

module.exports = upload;
