const FaceRecognitionTester = require('./test-face-recognition');

async function performanceTest() {
  const tester = new FaceRecognitionTester();
  
  // Simulate concurrent requests
  const concurrentTests = 5;
  const promises = [];
  
  console.log(`🧪 Testing with ${concurrentTests} concurrent requests...`);
  
  for (let i = 0; i < concurrentTests; i++) {
    promises.push(
      tester.singleTest(
        './test-data/person2_photo1.jpg',
        './test-data/person2_photo2.jpg',
        true
      )
    );
  }
  
  const results = await Promise.all(promises);
  const responseTimes = results.filter(r => r).map(r => r.responseTime);
  
  console.log('📊 Performance Results:');
  console.log(`Average Response Time: ${(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2)}ms`);
  console.log(`Min: ${Math.min(...responseTimes)}ms`);
  console.log(`Max: ${Math.max(...responseTimes)}ms`);
}

performanceTest().catch(console.error);