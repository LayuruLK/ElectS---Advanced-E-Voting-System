const express = require("express");
const router = express.Router();
const { candidateDescription } = require("../models/candidateDescription");
const { Candidate } = require("../models/candidate");

// Create (Add) Description - Only if not already exists
router.post("/add/:id", async (req, res) => {
    const userID = req.params.id;
    try {
        const candidate = await Candidate.findOne({ user: userID });
        const { description } = req.body;

        if (!candidate) {
            return res.status(400).json({ error: "Candidate Not Found" });
        }

        if (!description) {
            return res.status(400).json({ error: "Description is required" });
        }

        // Check if a description already exists for this candidate
        const existingDescription = await candidateDescription.findOne({ candidate });

        if (existingDescription) {
            return res.status(400).json({ error: "Description already exists. Please update it instead." });
        }

        // If no existing description, create a new one
        const newDescription = new candidateDescription({ candidate, description });
        await newDescription.save();

        res.status(201).json({ message: "Description added successfully", data: newDescription });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read (View) Description by Candidate ID
router.get("/view/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const candidate = await Candidate.findOne({ user: userId });
        if (!candidate) {
            return res.status(404).json({ error: "Candidate not found" });
        }

        const description = await candidateDescription.findOne({ candidate });

        /* if (!description) {
            return res.status(404).json({ error: "Description not found" });
        } */

        res.status(200).json(description);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update (Edit) Description - To modify existing description
router.put("/edit/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const candidate = await Candidate.findOne({ user: userId });
        const { description } = req.body;

        if (!candidate) {
            return res.status(404).json({ error: "Candidate not found" });
        }

        if (!description) {
            return res.status(400).json({ error: "Description is required" });
        }

        const updatedDescription = await candidateDescription.findOneAndUpdate(
            { candidate },
            { description },
            { new: true, runValidators: true }
        );

        if (!updatedDescription) {
            return res.status(404).json({ error: "Description not found" });
        }

        res.status(200).json({ message: "Description updated successfully", data: updatedDescription });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Description
router.delete("/delete/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const candidate = await Candidate.findOne({ user: userId });

        if (!candidate) {
            return res.status(404).json({ error: "Candidate not found" });
        }

        const deletedDescription = await candidateDescription.findOneAndDelete({ candidate });

        if (!deletedDescription) {
            return res.status(404).json({ error: "Description not found" });
        }

        res.status(200).json({ message: "Description deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
