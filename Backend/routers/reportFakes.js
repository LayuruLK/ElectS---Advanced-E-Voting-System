const express = require('express');
const ReportFake = require('../models/reportFake');
const reportFake = require('../models/reportFake');
const { Complaint } = require('../models/complaint');

const multer = require('multer');
const cloudinaryStorage = require('../helpers/cloudinaryStorage');
const uploadFile = multer({ storage: cloudinaryStorage });

const router = express.Router();

router.post('/', uploadFile.array('proofs'), async (req, res) => {
  try {
    const { complaintId, explanation } = req.body;
    const proofs = req.files.map((file) => file.path);

    const newReport = new ReportFake({ complaintId, explanation, proofs });
    await newReport.save();

    res.status(201).json({ message: 'Report submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit the report' });
  }
});

// Fetch all unreviewed reports
router.get('/unreviewed', async (req, res) => {
  try {
    const reports = await reportFake.find({ isReviewed: false }).populate('complaintId');
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Update isReviewed to true and remove the complaint from the candidate's profile
router.put('/resolve/:reportId', async (req, res) => {
  const { reportId } = req.params;

  try {
    const report = await ReportFake.findById(reportId).populate('complaintId');
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Mark the report as reviewed
    report.isReviewed = true;
    await report.save();

    // Remove the complaint if the admin decides to act
    await Complaint.findByIdAndDelete(report.complaintId._id);

    res.status(200).json({ message: 'Complaint removed and report marked as reviewed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to resolve the report' });
  }
});

// Mark the report as rejected
router.put('/reject/:reportId', async (req, res) => {
  const { reportId } = req.params;

  try {
    const report = await ReportFake.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    report.isReviewed = true;
    await report.save();

    res.status(200).json({ message: 'Report marked as rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject the report' });
  }
});


router.get('/get/pendingverifications/count', async (req, res) => {
    try {
      const pendingUsersCount = await reportFake.countDocuments({ isReviewed: false });
      res.status(200).json({ success: true, count: pendingUsersCount });
    } catch (error) {
      console.error('Error fetching pending verifications count:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });


module.exports = router;