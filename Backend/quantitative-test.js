const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class QuantitativeTester {
  constructor(baseURL) {
    this.baseURL = 'http://localhost:5000/api/v1/test/face-recognition';
    this.metrics = {
      accuracy: 0,
      responseTimes: [],
      falseAcceptRate: 0,
      falseRejectRate: 0,
      throughput: 0,
      loadCapacity: 0
    };
  }

  async singleTest(sourceImagePath, targetImagePath, expectedMatch) {
    const formData = new FormData();
    formData.append('sourceImage', fs.createReadStream(sourceImagePath));
    formData.append('targetImage', fs.createReadStream(targetImagePath));
    formData.append('expectedMatch', expectedMatch.toString());

    const startTime = Date.now();
    try {
      const response = await axios.post(`${this.baseURL}/accuracy-test`, formData, {
        headers: formData.getHeaders(),
      });
      const responseTime = Date.now() - startTime;
      
      return {
        ...response.data,
        responseTime: responseTime
      };
    } catch (error) {
      console.error('Test failed:', error.response?.data || error.message);
      return null;
    }
  }

  // Load Testing - Simulate multiple concurrent users
  async loadTest(concurrentUsers = 5, testCase) {
    console.log(`\n🧪 Load Testing: ${concurrentUsers} concurrent users`);
    
    const promises = [];
    const startTime = Date.now();
    
    for (let i = 0; i < concurrentUsers; i++) {
      promises.push(this.singleTest(
        testCase.sourceImage,
        testCase.targetImage,
        testCase.expectedMatch
      ));
      
      // Stagger requests to simulate real users
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const results = await Promise.all(promises);
    const totalTime = Date.now() - startTime;
    
    const successfulResults = results.filter(r => r !== null);
    const responseTimes = successfulResults.map(r => r.responseTime);
    
    return {
      concurrentUsers,
      totalTime,
      successfulRequests: successfulResults.length,
      failedRequests: results.length - successfulResults.length,
      avgResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      throughput: (successfulResults.length / totalTime) * 1000 // requests per second
    };
  }

  // Comprehensive evaluation
  async runQuantitativeEvaluation(testCases) {
    console.log('🚀 Starting Quantitative Evaluation...\n');
    
    const results = {
      totalTests: 0,
      correctPredictions: 0,
      falseAccepts: 0,
      falseRejects: 0,
      responseTimes: [],
      categoryBreakdown: {}
    };

    // 1. Accuracy Testing
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`Running accuracy test ${i + 1}/${testCases.length}: ${testCase.description}`);
      
      const result = await this.singleTest(
        testCase.sourceImage,
        testCase.targetImage,
        testCase.expectedMatch
      );

      if (result) {
        this.processResult(results, testCase, result);
      }

      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // 2. Performance/Load Testing
    console.log('\n📊 Running Performance Tests...');
    const loadTestResults = [];
    const concurrentLevels = [1, 3, 5, 10];
    
    for (const users of concurrentLevels) {
      const loadResult = await this.loadTest(users, testCases[0]);
      loadTestResults.push(loadResult);
    }

    // 3. Calculate Final Metrics
    const finalMetrics = this.calculateMetrics(results, loadTestResults);
    
    // 4. Generate Report
    this.generateReport(finalMetrics, results, loadTestResults);
    
    return finalMetrics;
  }

  processResult(results, testCase, result) {
    results.totalTests++;
    results.responseTimes.push(result.responseTime);
    
    // Initialize category if not exists
    if (!results.categoryBreakdown[testCase.category]) {
      results.categoryBreakdown[testCase.category] = {
        total: 0,
        correct: 0
      };
    }
    
    results.categoryBreakdown[testCase.category].total++;
    
    if (result.isCorrect) {
      results.correctPredictions++;
      results.categoryBreakdown[testCase.category].correct++;
    } else {
      if (testCase.expectedMatch && !result.actualMatch) {
        results.falseRejects++;
      } else if (!testCase.expectedMatch && result.actualMatch) {
        results.falseAccepts++;
      }
    }
  }

  calculateMetrics(results, loadTestResults) {
    const accuracy = (results.correctPredictions / results.totalTests) * 100;
    const falseAcceptRate = (results.falseAccepts / results.totalTests) * 100;
    const falseRejectRate = (results.falseRejects / results.totalTests) * 100;
    
    const avgResponseTime = results.responseTimes.reduce((a, b) => a + b, 0) / results.responseTimes.length;
    const p95ResponseTime = this.calculatePercentile(results.responseTimes, 95);
    
    // Calculate load capacity (max users while maintaining <3s response time)
    const loadCapacity = loadTestResults.filter(r => r.avgResponseTime < 3000).length * 5;

    return {
      accuracy: parseFloat(accuracy.toFixed(2)),
      falseAcceptRate: parseFloat(falseAcceptRate.toFixed(2)),
      falseRejectRate: parseFloat(falseRejectRate.toFixed(2)),
      avgResponseTime: parseFloat(avgResponseTime.toFixed(2)),
      p95ResponseTime: parseFloat(p95ResponseTime.toFixed(2)),
      throughput: parseFloat((loadTestResults[0]?.throughput || 0).toFixed(2)),
      loadCapacity,
      totalTests: results.totalTests
    };
  }

  calculatePercentile(arr, percentile) {
    const sorted = [...arr].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    return sorted[Math.floor(index)];
  }

  generateReport(metrics, results, loadTestResults) {
    console.log('\n' + '='.repeat(80));
    console.log('📈 QUANTITATIVE EVALUATION REPORT');
    console.log('='.repeat(80));
    
    console.log('\n🎯 ACCURACY METRICS:');
    console.log('─'.repeat(40));
    console.log(`Overall Accuracy:        ${metrics.accuracy}%`);
    console.log(`False Acceptance Rate:   ${metrics.falseAcceptRate}%`);
    console.log(`False Rejection Rate:    ${metrics.falseRejectRate}%`);
    console.log(`Total Tests:             ${metrics.totalTests}`);
    
    console.log('\n⏱️  PERFORMANCE METRICS:');
    console.log('─'.repeat(40));
    console.log(`Average Response Time:   ${metrics.avgResponseTime}ms`);
    console.log(`95th Percentile:         ${metrics.p95ResponseTime}ms`);
    console.log(`Throughput:              ${metrics.throughput} req/sec`);
    console.log(`Load Capacity:           ${metrics.loadCapacity} concurrent users`);
    
    console.log('\n📊 CATEGORY BREAKDOWN:');
    console.log('─'.repeat(40));
    Object.entries(results.categoryBreakdown).forEach(([category, data]) => {
      const accuracy = (data.correct / data.total) * 100;
      console.log(`${category.padEnd(20)}: ${accuracy.toFixed(1)}% (${data.correct}/${data.total})`);
    });
    
    console.log('\n🚀 LOAD TEST RESULTS:');
    console.log('─'.repeat(40));
    loadTestResults.forEach(result => {
      console.log(`${result.concurrentUsers} users: ${result.avgResponseTime.toFixed(0)}ms avg, ${result.throughput.toFixed(2)} req/sec, ${result.successfulRequests}/${result.concurrentUsers} successful`);
    });
    
    console.log('\n⚠️  LIMITATIONS:');
    console.log('─'.repeat(40));
    console.log('• Dependent on AWS Rekognition API latency');
    console.log('• Network conditions may affect response times');
    console.log('• Test dataset size: Limited to available images');
    console.log('• No real-world environmental variations tested');
    console.log('• Does not account for hardware resource constraints');
    
    console.log('\n' + '='.repeat(80));
  }
}

// Enhanced test cases with categories
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

// Run the evaluation
async function main() {
  const tester = new QuantitativeTester();
  
  if (!fs.existsSync('test-data')) {
    fs.mkdirSync('test-data');
    console.log('📁 Please add your test images to the test-data directory');
    return;
  }

  await tester.runQuantitativeEvaluation(testCases);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = QuantitativeTester;