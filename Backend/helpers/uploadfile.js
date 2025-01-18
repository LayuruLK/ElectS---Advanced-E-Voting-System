const multer = require('multer');

// File storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); // Path where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname); // Filename with timestamp
    }
});

// File type filtering
const fileFilter = (req, file, cb) => {
    // Allowed file types: Images, PDFs, Videos
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || 
        file.mimetype === 'application/pdf' || 
        file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(null, false); // Reject other file types
    }
};

// Upload setup with file size limits
const uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50 // Limit: 50MB per file
    },
    fileFilter: fileFilter
});

module.exports = uploadFile;
