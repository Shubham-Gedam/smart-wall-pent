import imagekit, { uploadFile } from "../config/imagekit.config.js";
import Media from "../models/media.model.js";;

// Upload media controller 
export async function uploadMediaController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image file is required" });
        }

        const { purpose } = req.body;

        const uploadResponse = await uploadFile(req.file, "/wall-paint-visualizer");

        const media = await Media.create({
            userId: req.user.id,
            fileId: uploadResponse.fileId,
            url: uploadResponse.url,
            thumbnailUrl: uploadResponse.thumbnailUrl,
            fileName: uploadResponse.name,
            fileType: req.file.mimetype,
            size: uploadResponse.size,
            width: uploadResponse.width,
            height: uploadResponse.height,
            purpose: purpose || "room-photo"
        });

        res.status(201).json({
            message: "Image uploaded successfully",
            media
        });
    } catch (error) {
        console.error("Upload media error:", error.message);
        res.status(500).json({ message: "Server error while uploading image" });
    }
}

// Get all media for the authenticated user
export async function getMyMediaController(req, res) {
    try {
        const media = await Media.find({ userId: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            count: media.length,
            media
        });
    } catch (error) {
        console.error("Get media error:", error.message);
        res.status(500).json({ message: "Server error while fetching media" });
    }
}

// Get media by ID for the authenticated user
export async function getMediaByIdController(req, res) {
    try {
        const media = await Media.findOne({ _id: req.params.id, userId: req.user.id });

        if (!media) {
            return res.status(404).json({ message: "Media not found" });
        }

        res.status(200).json({ media });
    } catch (error) {
        console.error("Get media by id error:", error.message);
        res.status(500).json({ message: "Server error while fetching media" });
    }
}

// Delete media by ID for the authenticated user
export async function deleteMediaController(req, res) {
    try {
        const media = await Media.findOne({ _id: req.params.id, userId: req.user.id });

        if (!media) {
            return res.status(404).json({ message: "Media not found" });
        }

        await imagekit.deleteFile(media.fileId);
        await media.deleteOne();

        res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        console.error("Delete media error:", error.message);
        res.status(500).json({ message: "Server error while deleting image" });
    }
}