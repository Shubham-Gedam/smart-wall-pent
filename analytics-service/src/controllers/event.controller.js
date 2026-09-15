import Event from "../models/event.model.js";

export async function logEventController(req, res) {
    try {
        const { eventType, metadata } = req.body;

        if (!eventType) {
            return res.status(400).json({ message: "eventType is required" });
        }

        const event = await Event.create({
            userId: req.user.id,
            eventType,
            metadata
        });

        res.status(201).json({
            message: "Event logged successfully",
            event
        });
    } catch (error) {
        console.error("Log event error:", error.message);
        res.status(500).json({ message: "Server error while logging event" });
    }
}

export async function getMyEventsController(req, res) {
    try {
        const events = await Event.find({ userId: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            count: events.length,
            events
        });
    } catch (error) {
        console.error("Get events error:", error.message);
        res.status(500).json({ message: "Server error while fetching events" });
    }
}