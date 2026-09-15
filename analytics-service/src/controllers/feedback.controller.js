import Feedback from "../models/feedback.model.js";

export async function submitFeedbackController(req, res) {
    try {
        const { rating, comment } = req.body;

        if (!rating) {
            return res.status(400).json({ message: "rating is required" });
        }

        const feedback = await Feedback.create({
            userId: req.user.id,
            rating,
            comment
        });

        res.status(201).json({
            message: "Feedback submitted successfully",
            feedback
        });
    } catch (error) {
        console.error("Submit feedback error:", error.message);
        res.status(500).json({ message: "Server error while submitting feedback" });
    }
}

export async function getAllFeedbackController(req, res) {
    try {
        const feedback = await Feedback.find().sort({ createdAt: -1 });

        res.status(200).json({
            count: feedback.length,
            feedback
        });
    } catch (error) {
        console.error("Get feedback error:", error.message);
        res.status(500).json({ message: "Server error while fetching feedback" });
    }
}