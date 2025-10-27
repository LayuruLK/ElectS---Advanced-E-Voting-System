const express = require('express');
const router = express.Router();
const { compareFaces } = require('../Services/compareFun');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Test-specific multer configuration
const testStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const testDir = 'test-uploads/';
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir);
    }
    cb(null, testDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'test-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const testUpload = multer({
  storage: testStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

// Test endpoint for accuracy measurement
router.post('/accuracy-test', testUpload.fields([
  { name: 'sourceImage', maxCount: 1 },
  { name: 'targetImage', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files || !req.files.sourceImage || !req.files.targetImage) {
      return res.status(400).json({ 
        success: false, 
        message: 'Both sourceImage and targetImage files are required' 
      });
    }

    const sourcePath = req.files.sourceImage[0].path;
    const targetPath = req.files.targetImage[0].path;
    const expectedMatch = req.body.expectedMatch === 'true'; // Expected result

    // Read both images
    const sourceBuffer = fs.readFileSync(sourcePath);
    const targetBuffer = fs.readFileSync(targetPath);

    // Measure response time
    const startTime = Date.now();
    const result = await compareFaces(sourceBuffer, targetBuffer);
    const responseTime = Date.now() - startTime;

    // Clean up test files
    await fs.promises.unlink(sourcePath);
    await fs.promises.unlink(targetPath);

    // Return detailed results for analysis
    res.json({
      testId: Date.now(),
      expectedMatch: expectedMatch,
      actualMatch: result.success,
      similarity: result.similarity || 0,
      responseTime: responseTime,
      isCorrect: result.success === expectedMatch,
      message: result.message
    });

  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Test failed: ' + error.message 
    });
  }
});

// Bulk testing endpoint
router.post('/bulk-test', express.json(), async (req, res) => {
  try {
    const { testPairs } = req.body; // Array of {sourceUrl, targetUrl, expectedMatch}
    
    if (!testPairs || !Array.isArray(testPairs)) {
      return res.status(400).json({ 
        success: false, 
        message: 'testPairs array is required' 
      });
    }

    const results = [];
    let correctPredictions = 0;

    for (let i = 0; i < testPairs.length; i++) {
      const pair = testPairs[i];
      
      try {
        // Download images (you might need to implement this)
        const sourceBuffer = await downloadImage(pair.sourceUrl);
        const targetBuffer = await downloadImage(pair.targetUrl);

        const startTime = Date.now();
        const result = await compareFaces(sourceBuffer, targetBuffer);
        const responseTime = Date.now() - startTime;

        const isCorrect = result.success === pair.expectedMatch;
        if (isCorrect) correctPredictions++;

        results.push({
          pairId: i,
          expected: pair.expectedMatch,
          actual: result.success,
          similarity: result.similarity || 0,
          responseTime: responseTime,
          isCorrect: isCorrect
        });

        // Small delay to avoid hitting AWS limits
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Error processing pair ${i}:`, error);
        results.push({
          pairId: i,
          error: error.message,
          isCorrect: false
        });
      }
    }

    const accuracy = (correctPredictions / testPairs.length) * 100;
    const avgResponseTime = results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / results.length;

    res.json({
      totalTests: testPairs.length,
      correctPredictions: correctPredictions,
      accuracy: accuracy.toFixed(2) + '%',
      averageResponseTime: avgResponseTime.toFixed(2) + 'ms',
      detailedResults: results
    });

  } catch (error) {
    console.error('Bulk test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Bulk test failed: ' + error.message 
    });
  }
});

// Helper function to download images
async function downloadImage(url) {
  const axios = require('axios');
  const response = await axios.get(url, { 
    responseType: 'arraybuffer',
    timeout: 10000 
  });
  return Buffer.from(response.data);
}

module.exports = router;