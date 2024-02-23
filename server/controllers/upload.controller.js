import Assignment from "../models/upload.model.js";
import { errorHandler } from "../utils/error.js";

export const upload = async (req, res, next) => {
  const { title, category, uploadLink } = req.body;

  if (!title || title === "") {
    next(errorHandler(400, "Please provide all fields"));
  }

  const newAssignment = new Assignment({
    userId: req.user.id,
    title,
    category,
    uploadLink,
  });
  try {
    const savedAssignment = await newAssignment.save();
    res.status(201).json({ savedAssignment });
  } catch (error) {
    next(error);
  }
};


export const getassignments = async (req, res, next) => {
  try {
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const assignments = await Assignment.find()
      .sort({ updatedAt: sortDirection })
      .populate("userId", "email phonenumber");

    const totalAssignments = await Assignment.countDocuments();
    const now = new Date();
    const oneWeekAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7
    );

    const lastweekAssignments = await Assignment.countDocuments({
      createdAt: { $gte: oneWeekAgo },
    });

    res.status(200).json({
      assignments,
      totalAssignments,
      lastweekAssignments,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteassignment = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this"));
  }
  try {
    await Assignment.findByIdAndDelete(req.params.assignmentId);
    res.status(200).json("Deleted");
  } catch (error) {
    next(error);
  }
};

export const updateApprovalStatus = async (req, res) => {
  const { assignmentId, userId } = req.params;
  const { isApproved } = req.body;
  try {
    const updatedAssignment = await Assignment.findOneAndUpdate(
      { _id: assignmentId, userId },
      { $set: { isApproved: true } },
      { new: true }
    );
    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res
      .status(200)
      .json({
        message: "Approved",
        updatedAssignment,
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


export const denyApprovalStatus = async (req, res) => {
  const { assignmentId, userId } = req.params;
  const { isDenied } = req.body;
  try {
    const updatedAssignment = await Assignment.findOneAndUpdate(
      { _id: assignmentId, userId },
      { $set: { isDenied: true } },
      { new: true }
    );
    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res
      .status(200)
      .json({
        message: "Denied",
        updatedAssignment,
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const completeStatus = async (req, res) => {
  const { assignmentId, userId } = req.params;
  const { isCompleted } = req.body;
  try {
    const updatedAssignment = await Assignment.findOneAndUpdate(
      { _id: assignmentId, userId },
      { $set: { isCompleted: true } },
      { new: true }
    );
    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res
      .status(200)
      .json({
        message: "Confirmed",
        updatedAssignment,
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
