import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        hex: {
            type: String,
            required: true,
            match: [/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, "Please provide a valid HEX code"]
        },
        rgb: {
            r: { type: Number, min: 0, max: 255 },
            g: { type: Number, min: 0, max: 255 },
            b: { type: Number, min: 0, max: 255 }
        },
        brand: { type: String, trim: true },
        finishOptions: {
            type: [String],
            enum: ["matte", "glossy", "satin", "eggshell"],
            default: ["matte"]
        },
        categoryTags: { type: [String], default: [] },
        swatchImageUrl: { type: String }
    },
    { timestamps: true }
);

const Color = mongoose.model("Color", colorSchema);

export default Color;