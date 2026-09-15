import Color from "../models/color.model.js";

export async function createColorController(req, res) {
    try {
        const { name, hex, rgb, brand, finishOptions, categoryTags, swatchImageUrl } = req.body;

        if (!name || !hex) {
            return res.status(400).json({ message: "name and hex are required" });
        }

        const color = await Color.create({
            name, hex, rgb, brand, finishOptions, categoryTags, swatchImageUrl
        });

        res.status(201).json({
            message: "Color created successfully",
            color
        });
    } catch (error) {
        console.error("Create color error:", error.message);
        res.status(500).json({ message: "Server error while creating color" });
    }
}

export async function getAllColorsController(req, res) {
    try {
        const { category } = req.query;
        const filter = category ? { categoryTags: category } : {};

        const colors = await Color.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            count: colors.length,
            colors
        });
    } catch (error) {
        console.error("Get colors error:", error.message);
        res.status(500).json({ message: "Server error while fetching colors" });
    }
}

export async function getColorByIdController(req, res) {
    try {
        const color = await Color.findById(req.params.id);

        if (!color) {
            return res.status(404).json({ message: "Color not found" });
        }

        res.status(200).json({ color });
    } catch (error) {
        console.error("Get color error:", error.message);
        res.status(500).json({ message: "Server error while fetching color" });
    }
}

export async function updateColorController(req, res) {
    try {
        const color = await Color.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!color) {
            return res.status(404).json({ message: "Color not found" });
        }

        res.status(200).json({
            message: "Color updated successfully",
            color
        });
    } catch (error) {
        console.error("Update color error:", error.message);
        res.status(500).json({ message: "Server error while updating color" });
    }
}

export async function deleteColorController(req, res) {
    try {
        const color = await Color.findByIdAndDelete(req.params.id);

        if (!color) {
            return res.status(404).json({ message: "Color not found" });
        }

        res.status(200).json({ message: "Color deleted successfully" });
    } catch (error) {
        console.error("Delete color error:", error.message);
        res.status(500).json({ message: "Server error while deleting color" });
    }
}