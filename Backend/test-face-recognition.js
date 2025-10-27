const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class FaceRecognitionTester {
  constructor(baseURL) {
    this.baseURL ='http://localhost:5000/api/v1/test/face-recognition';
  }

  async singleTest(sourceImagePath, targetImagePath, expectedMatch) {
    const formData = new FormData();
    
    formData.append('sourceImage', fs.createReadStream(sourceImagePath));
    formData.append('targetImage', fs.createReadStream(targetImagePath));
    formData.append('expectedMatch', expectedMatch.toString());

    try {
      const response = await axios.post(`http://localhost:5000/api/v1/test/face-recognition/accuracy-test`, formData, {
        headers: formData.getHeaders(),
      });
      
      return response.data;
    } catch (error) {
      console.error('Test failed:', error.response?.data || error.message);
      return null;
    }
  }

  async runTestSuite(testCases) {
    console.log('🚀 Starting Face Recognition Test Suite...\n');
    
    const results = [];
    let correct = 0;

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`Running test ${i + 1}/${testCases.length}: ${testCase.description}`);
      
      const result = await this.singleTest(
        testCase.sourceImage,
        testCase.targetImage,
        testCase.expectedMatch
      );

      if (result) {
        results.push(result);
        if (result.isCorrect) correct++;
        
        console.log(`  ✅ Expected: ${testCase.expectedMatch}, Got: ${result.actualMatch}`);
        console.log(`  ⏱️  Response Time: ${result.responseTime}ms`);
        console.log(`  📊 Similarity: ${result.similarity}%\n`);
      } else {
        console.log(`  ❌ Test failed\n`);
      }

      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const accuracy = (correct / testCases.length) * 100;
    const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

    console.log('📈 TEST SUMMARY');
    console.log('===============');
    console.log(`Total Tests: ${testCases.length}`);
    console.log(`Correct: ${correct}`);
    console.log(`Accuracy: ${accuracy.toFixed(2)}%`);
    console.log(`Average Response Time: ${avgResponseTime.toFixed(2)}ms`);

    return { accuracy, avgResponseTime, detailedResults: results };
  }
}

// Example test cases
const testCases = [
  // Person 2 - Same person tests (3 tests)
  {
    description: "Same person - Person 2 (1 vs 2)",
    sourceImage: './test-data/person2_photo1.jpg',
    targetImage: './test-data/person2_photo2.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 2 (1 vs 3)",
    sourceImage: './test-data/person2_photo1.jpg',
    targetImage: './test-data/person2_photo3.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 2 (1 vs 4)",
    sourceImage: './test-data/person2_photo1.jpg',
    targetImage: './test-data/person2_photo4.jpg',
    expectedMatch: true
  },

  // Person 5 - Same person tests (3 tests)
  {
    description: "Same person - Person 5 (1 vs 2)",
    sourceImage: './test-data/person5_photo1.jpg',
    targetImage: './test-data/person5_photo2.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 5 (1 vs 3)",
    sourceImage: './test-data/person5_photo1.jpg',
    targetImage: './test-data/person5_photo3.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 5 (1 vs 4)",
    sourceImage: './test-data/person5_photo1.jpg',
    targetImage: './test-data/person5_photo4.jpg',
    expectedMatch: true
  },

  // Person 7 - Same person tests (3 tests)
  {
    description: "Same person - Person 7 (1 vs 2)",
    sourceImage: './test-data/person7_photo1.jpg',
    targetImage: './test-data/person7_photo2.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 7 (1 vs 3)",
    sourceImage: './test-data/person7_photo1.jpg',
    targetImage: './test-data/person7_photo3.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 7 (1 vs 4)",
    sourceImage: './test-data/person7_photo1.jpg',
    targetImage: './test-data/person7_photo4.jpg',
    expectedMatch: true
  },

  // Person 8 - Same person tests (3 tests)
  {
    description: "Same person - Person 8 (1 vs 2)",
    sourceImage: './test-data/person8_photo1.jpg',
    targetImage: './test-data/person8_photo2.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 8 (1 vs 3)",
    sourceImage: './test-data/person8_photo1.jpg',
    targetImage: './test-data/person8_photo3.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 8 (1 vs 4)",
    sourceImage: './test-data/person8_photo1.jpg',
    targetImage: './test-data/person8_photo4.jpg',
    expectedMatch: true
  },

  // Person 9 - Same person tests (7 tests)
  {
    description: "Same person - Person 9 (1 vs 2)",
    sourceImage: './test-data/person9_photo1.jpg',
    targetImage: './test-data/person9_photo2.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 9 (1 vs 3)",
    sourceImage: './test-data/person9_photo1.jpg',
    targetImage: './test-data/person9_photo3.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 9 (1 vs 4)",
    sourceImage: './test-data/person9_photo1.jpg',
    targetImage: './test-data/person9_photo4.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 9 (1 vs 5)",
    sourceImage: './test-data/person9_photo1.jpg',
    targetImage: './test-data/person9_photo5.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 9 (1 vs 6)",
    sourceImage: './test-data/person9_photo1.jpg',
    targetImage: './test-data/person9_photo6.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 9 (1 vs 7)",
    sourceImage: './test-data/person9_photo1.jpg',
    targetImage: './test-data/person9_photo7.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 9 (1 vs 8)",
    sourceImage: './test-data/person9_photo1.jpg',
    targetImage: './test-data/person9_photo8.jpg',
    expectedMatch: true
  },

  // Person 10 - Same person tests (4 tests)
  {
    description: "Same person - Person 10 (1 vs 2)",
    sourceImage: './test-data/person10_photo1.jpg',
    targetImage: './test-data/person10_photo2.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 10 (1 vs 3)",
    sourceImage: './test-data/person10_photo1.jpg',
    targetImage: './test-data/person10_photo3.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 10 (1 vs 4)",
    sourceImage: './test-data/person10_photo1.jpg',
    targetImage: './test-data/person10_photo4.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 10 (1 vs 5)",
    sourceImage: './test-data/person10_photo1.jpg',
    targetImage: './test-data/person10_photo5.jpg',
    expectedMatch: true
  },

  // Person 11 - Same person tests (2 tests)
  {
    description: "Same person - Person 11 (1 vs 2)",
    sourceImage: './test-data/person11_photo1.jpg',
    targetImage: './test-data/person11_photo2.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 11 (1 vs 3)",
    sourceImage: './test-data/person11_photo1.jpg',
    targetImage: './test-data/person11_photo3.jpg',
    expectedMatch: true
  },

  // Different people tests - Cross combinations (78 tests)

  // Person 1 vs Others (10 tests)
  {
    description: "Different people (1 vs 2)",
    sourceImage: './test-data/person1_photo1.jpg',
    targetImage: './test-data/person2_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (1 vs 3)",
    sourceImage: './test-data/person1_photo1.jpg',
    targetImage: './test-data/person3_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (1 vs 4)",
    sourceImage: './test-data/person1_photo1.jpg',
    targetImage: './test-data/person4_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (1 vs 5)",
    sourceImage: './test-data/person1_photo1.jpg',
    targetImage: './test-data/person5_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (1 vs 6)",
    sourceImage: './test-data/person1_photo1.jpg',
    targetImage: './test-data/person6_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (1 vs 7)",
    sourceImage: './test-data/person1_photo1.jpg',
    targetImage: './test-data/person7_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (1 vs 8)",
    sourceImage: './test-data/person1_photo1.jpg',
    targetImage: './test-data/person8_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (1 vs 9)",
    sourceImage: './test-data/person1_photo1.jpg',
    targetImage: './test-data/person9_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (1 vs 10)",
    sourceImage: './test-data/person1_photo1.jpg',
    targetImage: './test-data/person10_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (1 vs 11)",
    sourceImage: './test-data/person1_photo1.jpg',
    targetImage: './test-data/person11_photo1.jpg',
    expectedMatch: false
  },

  // Person 2 vs Others (9 tests)
  {
    description: "Different people (2 vs 3)",
    sourceImage: './test-data/person2_photo1.jpg',
    targetImage: './test-data/person3_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (2 vs 4)",
    sourceImage: './test-data/person2_photo1.jpg',
    targetImage: './test-data/person4_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (2 vs 5)",
    sourceImage: './test-data/person2_photo1.jpg',
    targetImage: './test-data/person5_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (2 vs 6)",
    sourceImage: './test-data/person2_photo1.jpg',
    targetImage: './test-data/person6_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (2 vs 7)",
    sourceImage: './test-data/person2_photo1.jpg',
    targetImage: './test-data/person7_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (2 vs 8)",
    sourceImage: './test-data/person2_photo1.jpg',
    targetImage: './test-data/person8_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (2 vs 9)",
    sourceImage: './test-data/person2_photo1.jpg',
    targetImage: './test-data/person9_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (2 vs 10)",
    sourceImage: './test-data/person2_photo1.jpg',
    targetImage: './test-data/person10_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (2 vs 11)",
    sourceImage: './test-data/person2_photo1.jpg',
    targetImage: './test-data/person11_photo1.jpg',
    expectedMatch: false
  },

  // Person 3 vs Others (8 tests)
  {
    description: "Different people (3 vs 4)",
    sourceImage: './test-data/person3_photo1.jpg',
    targetImage: './test-data/person4_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (3 vs 5)",
    sourceImage: './test-data/person3_photo1.jpg',
    targetImage: './test-data/person5_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (3 vs 6)",
    sourceImage: './test-data/person3_photo1.jpg',
    targetImage: './test-data/person6_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (3 vs 7)",
    sourceImage: './test-data/person3_photo1.jpg',
    targetImage: './test-data/person7_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (3 vs 8)",
    sourceImage: './test-data/person3_photo1.jpg',
    targetImage: './test-data/person8_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (3 vs 9)",
    sourceImage: './test-data/person3_photo1.jpg',
    targetImage: './test-data/person9_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (3 vs 10)",
    sourceImage: './test-data/person3_photo1.jpg',
    targetImage: './test-data/person10_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (3 vs 11)",
    sourceImage: './test-data/person3_photo1.jpg',
    targetImage: './test-data/person11_photo1.jpg',
    expectedMatch: false
  },

  // Person 4 vs Others (7 tests)
  {
    description: "Different people (4 vs 5)",
    sourceImage: './test-data/person4_photo1.jpg',
    targetImage: './test-data/person5_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (4 vs 6)",
    sourceImage: './test-data/person4_photo1.jpg',
    targetImage: './test-data/person6_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (4 vs 7)",
    sourceImage: './test-data/person4_photo1.jpg',
    targetImage: './test-data/person7_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (4 vs 8)",
    sourceImage: './test-data/person4_photo1.jpg',
    targetImage: './test-data/person8_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (4 vs 9)",
    sourceImage: './test-data/person4_photo1.jpg',
    targetImage: './test-data/person9_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (4 vs 10)",
    sourceImage: './test-data/person4_photo1.jpg',
    targetImage: './test-data/person10_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (4 vs 11)",
    sourceImage: './test-data/person4_photo1.jpg',
    targetImage: './test-data/person11_photo1.jpg',
    expectedMatch: false
  },

  // Person 5 vs Others (6 tests)
  {
    description: "Different people (5 vs 6)",
    sourceImage: './test-data/person5_photo1.jpg',
    targetImage: './test-data/person6_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (5 vs 7)",
    sourceImage: './test-data/person5_photo1.jpg',
    targetImage: './test-data/person7_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (5 vs 8)",
    sourceImage: './test-data/person5_photo1.jpg',
    targetImage: './test-data/person8_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (5 vs 9)",
    sourceImage: './test-data/person5_photo1.jpg',
    targetImage: './test-data/person9_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (5 vs 10)",
    sourceImage: './test-data/person5_photo1.jpg',
    targetImage: './test-data/person10_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (5 vs 11)",
    sourceImage: './test-data/person5_photo1.jpg',
    targetImage: './test-data/person11_photo1.jpg',
    expectedMatch: false
  },

  // Person 6 vs Others (5 tests)
  {
    description: "Different people (6 vs 7)",
    sourceImage: './test-data/person6_photo1.jpg',
    targetImage: './test-data/person7_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (6 vs 8)",
    sourceImage: './test-data/person6_photo1.jpg',
    targetImage: './test-data/person8_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (6 vs 9)",
    sourceImage: './test-data/person6_photo1.jpg',
    targetImage: './test-data/person9_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (6 vs 10)",
    sourceImage: './test-data/person6_photo1.jpg',
    targetImage: './test-data/person10_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (6 vs 11)",
    sourceImage: './test-data/person6_photo1.jpg',
    targetImage: './test-data/person11_photo1.jpg',
    expectedMatch: false
  },

  // Person 7 vs Others (4 tests)
  {
    description: "Different people (7 vs 8)",
    sourceImage: './test-data/person7_photo1.jpg',
    targetImage: './test-data/person8_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (7 vs 9)",
    sourceImage: './test-data/person7_photo1.jpg',
    targetImage: './test-data/person9_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (7 vs 10)",
    sourceImage: './test-data/person7_photo1.jpg',
    targetImage: './test-data/person10_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (7 vs 11)",
    sourceImage: './test-data/person7_photo1.jpg',
    targetImage: './test-data/person11_photo1.jpg',
    expectedMatch: false
  },

  // Person 8 vs Others (3 tests)
  {
    description: "Different people (8 vs 9)",
    sourceImage: './test-data/person8_photo1.jpg',
    targetImage: './test-data/person9_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (8 vs 10)",
    sourceImage: './test-data/person8_photo1.jpg',
    targetImage: './test-data/person10_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (8 vs 11)",
    sourceImage: './test-data/person8_photo1.jpg',
    targetImage: './test-data/person11_photo1.jpg',
    expectedMatch: false
  },

  // Person 9 vs Others (2 tests)
  {
    description: "Different people (9 vs 10)",
    sourceImage: './test-data/person9_photo1.jpg',
    targetImage: './test-data/person10_photo1.jpg',
    expectedMatch: false
  },
  {
    description: "Different people (9 vs 11)",
    sourceImage: './test-data/person9_photo1.jpg',
    targetImage: './test-data/person11_photo1.jpg',
    expectedMatch: false
  },

  // Person 10 vs Others (1 test)
  {
    description: "Different people (10 vs 11)",
    sourceImage: './test-data/person10_photo1.jpg',
    targetImage: './test-data/person11_photo1.jpg',
    expectedMatch: false
  },

  // Additional cross-photo tests for same people (10 tests)
  {
    description: "Same person - Person 9 (2 vs 3)",
    sourceImage: './test-data/person9_photo2.jpg',
    targetImage: './test-data/person9_photo3.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 9 (4 vs 5)",
    sourceImage: './test-data/person9_photo4.jpg',
    targetImage: './test-data/person9_photo5.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 10 (2 vs 3)",
    sourceImage: './test-data/person10_photo2.jpg',
    targetImage: './test-data/person10_photo3.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 10 (4 vs 5)",
    sourceImage: './test-data/person10_photo4.jpg',
    targetImage: './test-data/person10_photo5.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 11 (2 vs 3)",
    sourceImage: './test-data/person11_photo2.jpg',
    targetImage: './test-data/person11_photo3.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 2 (2 vs 3)",
    sourceImage: './test-data/person2_photo2.jpg',
    targetImage: './test-data/person2_photo3.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 5 (2 vs 4)",
    sourceImage: './test-data/person5_photo2.jpg',
    targetImage: './test-data/person5_photo4.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 7 (3 vs 4)",
    sourceImage: './test-data/person7_photo3.jpg',
    targetImage: './test-data/person7_photo4.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 8 (2 vs 4)",
    sourceImage: './test-data/person8_photo2.jpg',
    targetImage: './test-data/person8_photo4.jpg',
    expectedMatch: true
  },
  {
    description: "Same person - Person 9 (6 vs 8)",
    sourceImage: './test-data/person9_photo6.jpg',
    targetImage: './test-data/person9_photo8.jpg',
    expectedMatch: true
  }
];

// Run the tests
async function main() {
  const tester = new FaceRecognitionTester();
  
  // Create test-data directory if it doesn't exist
  if (!fs.existsSync('test-data')) {
    fs.mkdirSync('test-data');
    console.log('📁 Please add your test images to the test-data directory');
    return;
  }

  await tester.runTestSuite(testCases);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = FaceRecognitionTester;