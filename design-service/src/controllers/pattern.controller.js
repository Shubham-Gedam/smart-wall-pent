import Pattern from "../models/pattern.model.js";

export async function createPatternController(req, res) {
    try {
        const { name, description, category, imageUrl, dimensions, scalingInfo } = req.body;

        if (!name || !imageUrl) {
            return res.status(400).json({ message: "name and imageUrl are required" });
        }

        const pattern = await Pattern.create({
            name, description, category, imageUrl, dimensions, scalingInfo
        });

        res.status(201).json({
            message: "Pattern created successfully",
            pattern
        });
    } catch (error) {
        console.error("Create pattern error:", error.message);
        res.status(500).json({ message: "Server error while creating pattern" });
    }
}

export async function getAllPatternsController(req, res) {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};

        const patterns = await Pattern.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            count: patterns.length,
            patterns
        });
    } catch (error) {
        console.error("Get patterns error:", error.message);
        res.status(500).json({ message: "Server error while fetching patterns" });
    }
}

export async function getPatternByIdController(req, res) {
    try {
        const pattern = await Pattern.findById(req.params.id);

        if (!pattern) {
            return res.status(404).json({ message: "Pattern not found" });
        }

        res.status(200).json({ pattern });
    } catch (error) {
        console.error("Get pattern error:", error.message);
        res.status(500).json({ message: "Server error while fetching pattern" });
    }
}

export async function updatePatternController(req, res) {
    try {
        const pattern = await Pattern.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!pattern) {
            return res.status(404).json({ message: "Pattern not found" });
        }

        res.status(200).json({
            message: "Pattern updated successfully",
            pattern
        });
    } catch (error) {
        console.error("Update pattern error:", error.message);
        res.status(500).json({ message: "Server error while updating pattern" });
    }
}

export async function deletePatternController(req, res) {
    try {
        const pattern = await Pattern.findByIdAndDelete(req.params.id);

        if (!pattern) {
            return res.status(404).json({ message: "Pattern not found" });
        }

        res.status(200).json({ message: "Pattern deleted successfully" });
    } catch (error) {
        console.error("Delete pattern error:", error.message);
        res.status(500).json({ message: "Server error while deleting pattern" });
    }
}