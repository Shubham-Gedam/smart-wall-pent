import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true 
        },
        eventType: {
            type: String,
            enum: ["image_upload", "design_saved", "session_start", "session_end"],
            required: true
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed // e.g. { projectId, durationSeconds }
        }
    },
    { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;