import Event from "../models/event.model.js";
import Feedback from "../models/feedback.model.js";

export async function getKPIsController(req, res) {
    try {
        const imagesUploaded = await Event.countDocuments({ eventType: "image_upload" });
        const designsSaved = await Event.countDocuments({ eventType: "design_saved" });

        const sessionEvents = await Event.find({
            eventType: "session_end",
            "metadata.durationSeconds": { $exists: true }
        });

        const avgSessionDuration =
            sessionEvents.length > 0
                ? sessionEvents.reduce((sum, e) => sum + (e.metadata.durationSeconds || 0), 0) / sessionEvents.length
                : 0;

        const feedbackDocs = await Feedback.find();
        const avgRating =
            feedbackDocs.length > 0
                ? feedbackDocs.reduce((sum, f) => sum + f.rating, 0) / feedbackDocs.length
                : 0;

        res.status(200).json({
            kpis: {
                imagesUploaded,
                designsSaved,
                averageSessionDurationSeconds: Math.round(avgSessionDuration),
                averageUserRating: Number(avgRating.toFixed(2)),
                totalFeedbackCount: feedbackDocs.length
            }
        });
    } catch (error) {
        console.error("Get KPIs error:", error.message);
        res.status(500).json({ message: "Server error while fetching KPIs" });
    }
}