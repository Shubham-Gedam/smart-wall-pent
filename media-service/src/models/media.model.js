import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true 
        },
        fileId: { 
            type: String, 
            required: true 
        }, 
        url: { 
            type: String, 
            required: true 
        },
        thumbnailUrl: { 
            type: String 
        },
        fileName: { 
            type: String, 
            required: true 
        },
        fileType: { 
            type: String 
        },
        size: { 
            type: Number 
        },
        width: { 
            type: Number 
        },
        height: { 
            type: Number 
        },
        purpose: {
            type: String,
            enum: ["room-photo", "final-preview", "other"],
            default: "room-photo"
        }
    },
    { timestamps: true }
);

const Media = mongoose.model("Media", mediaSchema);

export default Media;