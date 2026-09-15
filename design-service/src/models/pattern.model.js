import mongoose from "mongoose";

const patternSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true, 
            trim: true 
        },
        description: { 
            type: String, 
            trim: true 
        },
        category: { 
            type: String, 
            trim: true 
        },
        imageUrl: { 
            type: String, 
            required: true 
        },
        dimensions: {
            width: { type: Number },
            height: { type: Number }
        },
        scalingInfo: { type: String }
    },
    { timestamps: true }
);

const Pattern = mongoose.model("Pattern", patternSchema);
export default Pattern;