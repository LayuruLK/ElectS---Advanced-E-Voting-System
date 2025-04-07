const { cloudinary } = require('./cloudinaryConfig');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    let resourceType = 'auto'; 

    if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
      resourceType = 'image'; 
    } else if (fileExtension === 'pdf') {
      resourceType = 'raw'; 
    }

    return {
      folder: 'elects_uploads',
      resource_type: resourceType, 
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  }
});

module.exports = storage;
