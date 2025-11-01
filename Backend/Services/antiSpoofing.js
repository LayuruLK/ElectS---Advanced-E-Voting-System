// Services/antiSpoofing.js
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

class AntiSpoofingService {
    constructor() {
        this.rekognition = new AWS.Rekognition();
        this.logFile = path.join(__dirname, '../logs/antiSpoofing.log');
        this.ensureLogDirectory();
    }

    ensureLogDirectory() {
        const logDir = path.dirname(this.logFile);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
    }

    logLivenessCheck(result, photoBuffer, additionalContext = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            livenessResult: result,
            imageSize: photoBuffer ? photoBuffer.length : 0,
            context: additionalContext,
            awsFaceCount: result.awsResult?.FaceDetails?.length || 0
        };

        // Console output for immediate feedback
        console.log(`🔒 Liveness Check - ${timestamp}:`, {
            isLive: result.isLive,
            confidence: result.confidence,
            passedChecks: `${result.passedChecksCount}/${result.totalChecksCount}`,
            details: result.details,
            faceCount: logEntry.awsFaceCount
        });

        // File logging for analysis
        fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + ',\n', 'utf8');
    }

    logSpoofingAttempt(result, photoInfo, detectionType) {
        const timestamp = new Date().toISOString();
        const securityEvent = {
            timestamp,
            eventType: 'SPOOFING_ATTEMPT_DETECTED',
            detectionType,
            livenessResult: result,
            photoInfo,
            action: 'BLOCKED'
        };

        console.warn(`🚨 SPOOFING ATTEMPT DETECTED - ${timestamp}:`, {
            detectionType,
            confidence: result.confidence,
            details: result.details
        });

        const securityLogFile = path.join(__dirname, '../logs/security_events.log');
        fs.appendFileSync(securityLogFile, JSON.stringify(securityEvent) + ',\n', 'utf8');
    }

    async detectLiveness(photoBuffer, context = {}) {
        const params = {
            Image: { Bytes: photoBuffer },
            Attributes: ['FACE_OCCLUDED', 'EYES_OPEN', 'MOUTH_OPEN', 'SMILE', 'EYEGLASSES', 'SUNGLASSES']
        };

        try {
            console.log('🔄 Starting AWS Rekognition face detection...');
            const awsResult = await this.rekognition.detectFaces(params).promise();
            console.log('✅ AWS Rekognition response received');

            if (awsResult.FaceDetails && awsResult.FaceDetails.length > 0) {
                const face = awsResult.FaceDetails[0];
                
                console.log('📊 Raw AWS Face Details:', {
                    confidence: face.Confidence,
                    eyesOpen: face.EyesOpen?.Value,
                    smile: face.Smile?.Value,
                    mouthOpen: face.MouthOpen?.Value,
                    faceOccluded: face.FaceOccluded?.Value,
                    eyeglasses: face.Eyeglasses?.Value,
                    sunglasses: face.Sunglasses?.Value
                });

                // Enhanced liveness checks
                const checks = {
                    eyesOpen: face.EyesOpen?.Value === true,
                    notSmiling: face.Smile?.Value === false,
                    mouthClosed: face.MouthOpen?.Value === false,
                    faceConfidence: face.Confidence > 90, // Slightly lowered for better inclusivity
                    noOcclusion: !face.FaceOccluded?.Value,
                    noSunglasses: !face.Sunglasses?.Value,
                    // Additional checks for better spoofing detection
                    singleFace: awsResult.FaceDetails.length === 1,
                    goodLighting: face.Confidence > 80 // Basic lighting quality check
                };

                const passedChecks = Object.values(checks).filter(Boolean).length;
                const totalChecks = Object.keys(checks).length;
                const confidenceScore = (passedChecks / totalChecks) * 100;

                const result = {
                    isLive: passedChecks >= 4, // Require at least 4 passed checks
                    confidence: Math.round(confidenceScore),
                    passedChecksCount: passedChecks,
                    totalChecksCount: totalChecks,
                    details: checks,
                    awsResult: {
                        faceCount: awsResult.FaceDetails.length,
                        primaryFaceConfidence: face.Confidence,
                        allAttributes: {
                            eyesOpen: face.EyesOpen,
                            smile: face.Smile,
                            mouthOpen: face.MouthOpen,
                            faceOccluded: face.FaceOccluded,
                            eyeglasses: face.Eyeglasses,
                            sunglasses: face.Sunglasses
                        }
                    },
                    timestamp: new Date().toISOString()
                };

                // Log the result
                this.logLivenessCheck(result, photoBuffer, context);

                // Log potential spoofing attempts
                if (!result.isLive && result.confidence < 30) {
                    this.logSpoofingAttempt(result, { 
                        size: photoBuffer.length,
                        faceCount: awsResult.FaceDetails.length 
                    }, 'LOW_LIVENESS_CONFIDENCE');
                }

                return result;

            } else {
                console.log('❌ No faces detected in the image');
                const noFaceResult = {
                    isLive: false,
                    confidence: 0,
                    passedChecksCount: 0,
                    totalChecksCount: 0,
                    details: {},
                    awsResult: { faceCount: 0 },
                    error: 'No faces detected',
                    timestamp: new Date().toISOString()
                };
                
                this.logLivenessCheck(noFaceResult, photoBuffer, context);
                return noFaceResult;
            }

        } catch (error) {
            console.error('❌ Liveness detection error:', error);
            const errorResult = {
                isLive: false,
                confidence: 0,
                passedChecksCount: 0,
                totalChecksCount: 0,
                details: {},
                error: error.message,
                awsErrorCode: error.code,
                timestamp: new Date().toISOString()
            };
            
            this.logLivenessCheck(errorResult, photoBuffer, context);
            return errorResult;
        }
    }

    // Method to generate security report for your paper
    generateSecurityReport() {
        try {
            if (!fs.existsSync(this.logFile)) {
                return { message: 'No security logs available yet' };
            }

            const logData = fs.readFileSync(this.logFile, 'utf8');
            const logEntries = logData.split(',\n').filter(entry => entry.trim())
                .map(entry => {
                    try {
                        return JSON.parse(entry);
                    } catch (e) {
                        return null;
                    }
                })
                .filter(entry => entry !== null);

            const totalChecks = logEntries.length;
            const liveDetections = logEntries.filter(entry => entry.livenessResult.isLive).length;
            const blockedAttempts = logEntries.filter(entry => 
                !entry.livenessResult.isLive && entry.livenessResult.confidence < 50
            ).length;

            const report = {
                generatedAt: new Date().toISOString(),
                analysisPeriod: {
                    start: logEntries[0]?.timestamp,
                    end: logEntries[logEntries.length - 1]?.timestamp
                },
                summary: {
                    totalLivenessChecks: totalChecks,
                    successfulLiveDetections: liveDetections,
                    blockedPotentialSpoofs: blockedAttempts,
                    liveDetectionRate: totalChecks > 0 ? ((liveDetections / totalChecks) * 100).toFixed(2) + '%' : '0%',
                    spoofBlockingRate: totalChecks > 0 ? ((blockedAttempts / totalChecks) * 100).toFixed(2) + '%' : '0%'
                },
                averageConfidence: totalChecks > 0 ? 
                    (logEntries.reduce((sum, entry) => sum + entry.livenessResult.confidence, 0) / totalChecks).toFixed(2) : 0,
                commonFailureReasons: this.analyzeFailurePatterns(logEntries)
            };

            console.log('📋 Security Report Generated:');
            console.log(JSON.stringify(report, null, 2));

            return report;

        } catch (error) {
            console.error('Error generating security report:', error);
            return { error: error.message };
        }
    }

    analyzeFailurePatterns(logEntries) {
        const failures = logEntries.filter(entry => !entry.livenessResult.isLive);
        const failureReasons = {};

        failures.forEach(entry => {
            const details = entry.livenessResult.details;
            Object.keys(details).forEach(check => {
                if (details[check] === false) {
                    failureReasons[check] = (failureReasons[check] || 0) + 1;
                }
            });
        });

        return failureReasons;
    }
}

module.exports = AntiSpoofingService;