import mongoose from "mongoose";

const wallSelectionSchema = new mongoose.Schema(
    {
        coordinates: {
            type: [[Number]], // polygon points e.g. [[x1,y1],[x2,y2],...]
            required: true
        },
        colorId: { type: mongoose.Schema.Types.ObjectId },
        patternId: { type: mongoose.Schema.Types.ObjectId },
        finish: {
            type: String,
            enum: ["matte", "glossy", "satin", "eggshell"],
            default: "matte"
        },
        opacity: { type: Number, min: 0, max: 1, default: 1 }
    },
    { _id: true }
);

const projectSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, required: true },
        title: { type: String, trim: true, default: "Untitled Project" },
        originalImageUrl: { type: String, required: true },
        wallSelections: { type: [wallSelectionSchema], default: [] },
        finalPreviewUrl: { type: String },
        status: { type: String, enum: ["draft", "saved"], default: "draft" }
    },
    { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;