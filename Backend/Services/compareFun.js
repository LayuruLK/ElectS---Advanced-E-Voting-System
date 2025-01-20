const AWS = require('aws-sdk');

// Configure AWS Rekognition
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const rekognition = new AWS.Rekognition();

const compareFaces = async (photoBuffer1, photoBuffer2) => {
  const params = {
    SourceImage: {
      Bytes: photoBuffer1,  // First photo (user's stored real-time photo)
    },
    TargetImage: {
      Bytes: photoBuffer2,  // Second photo (newly uploaded photo for comparison)
    },
    SimilarityThreshold: 90,  // Minimum similarity percentage for match
  };

  try {
    const data = await rekognition.compareFaces(params).promise();  // Call Rekognition API

    // Check if any face matches
    if (data.FaceMatches && data.FaceMatches.length > 0) {
      const similarity = data.FaceMatches[0].Similarity;
      if (similarity >= 90) {
        console.log('Faces matched with similarity:', similarity);
        return { success: true, message: `Faces matched with similarity: ${similarity}%` };
      } else {
        console.log('Faces do not match with sufficient similarity.');
        return { success: false, message: 'Faces do not match with sufficient similarity.' };
      }
    } else {
      // No face match found
      console.log('No face match found');
      return { success: false, message: 'No face match found' };
    }
  } catch (err) {
    console.error('Error during face comparison:', err);
    return { success: false, message: 'Facial recognition failed. Please try again.' };
  }
};

module.exports = { compareFaces };
