import Project from "../models/project.model.js";

export async function createProjectController(req, res) {
    try {
        const { title, originalImageUrl } = req.body;

        if (!originalImageUrl) {
            return res.status(400).json({ message: "originalImageUrl is required" });
        }

        const project = await Project.create({
            userId: req.user.id,
            title,
            originalImageUrl
        });

        res.status(201).json({
            message: "Project created successfully",
            project
        });
    } catch (error) {
        console.error("Create project error:", error.message);
        res.status(500).json({ message: "Server error while creating project" });
    }
}

export async function getMyProjectsController(req, res) {
    try {
        const projects = await Project.find({ userId: req.user.id }).sort({ updatedAt: -1 });

        res.status(200).json({
            count: projects.length,
            projects
        });
    } catch (error) {
        console.error("Get projects error:", error.message);
        res.status(500).json({ message: "Server error while fetching projects" });
    }
}

export async function getProjectByIdController(req, res) {
    try {
        const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ project });
    } catch (error) {
        console.error("Get project error:", error.message);
        res.status(500).json({ message: "Server error while fetching project" });
    }
}

export async function updateProjectController(req, res) {
    try {
        const { title, wallSelections, finalPreviewUrl, status } = req.body;

        const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (title !== undefined) project.title = title;
        if (wallSelections !== undefined) project.wallSelections = wallSelections;
        if (finalPreviewUrl !== undefined) project.finalPreviewUrl = finalPreviewUrl;
        if (status !== undefined) project.status = status;

        await project.save();

        res.status(200).json({
            message: "Project updated successfully",
            project
        });
    } catch (error) {
        console.error("Update project error:", error.message);
        res.status(500).json({ message: "Server error while updating project" });
    }
}

export async function deleteProjectController(req, res) {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Delete project error:", error.message);
        res.status(500).json({ message: "Server error while deleting project" });
    }
}

export async function getAllProjectsAdminController(req, res) {
    try {
        const { userId, status, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (userId) filter.userId = userId;
        if (status) filter.status = status;

        const skip = (Number(page) - 1) * Number(limit);

        const [projects, total] = await Promise.all([
            Project.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(Number(limit)),
            Project.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            projects
        });
    } catch (error) {
        console.error("Get all projects (admin) error:", error.message);
        res.status(500).json({ success: false, message: "Server error while fetching all projects" });
    }
}

export async function downloadProjectImageController(req, res) {
    try {
        const project = await Project.findOne({ _id: req.params.id, userId: req.user.id });

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        const imageUrl = project.finalPreviewUrl || project.originalImageUrl;

        if (!imageUrl) {
            return res.status(404).json({ success: false, message: "No image available for this project" });
        }

        const response = await fetch(imageUrl);

        if (!response.ok) {
            return res.status(502).json({ success: false, message: "Failed to fetch image from storage" });
        }

        const contentType = response.headers.get("content-type") || "image/jpeg";
        const fileName = `${project.title.replace(/\s+/g, "-")}-${project._id}.jpg`;

        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

        const buffer = Buffer.from(await response.arrayBuffer());
        res.send(buffer);
    } catch (error) {
        console.error("Download project image error:", error.message);
        res.status(500).json({ success: false, message: "Server error while downloading image" });
    }
}