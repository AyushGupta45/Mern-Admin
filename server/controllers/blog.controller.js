import Blog from "../models/blog.model.js";
import { errorHandler } from "../utils/error.js";

export const blog = async (req, res, next) => {
  const { title, content, uploadLink } = req.body;

  if (!title || title === "" || !content || content === "") {
    return next(errorHandler(400, "Please provide all fields"));
  }

  let finalUploadLink = uploadLink;
  if (!finalUploadLink || finalUploadLink === "") {
    finalUploadLink =
      "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  }

  const newBlog = new Blog({
    userId: req.user.id,
    title,
    uploadLink: finalUploadLink,
    content,
  });

  try {
    const savedBlog = await newBlog.save();
    res.status(201).json({ savedBlog });
  } catch (error) {
    next(error);
  }
};

export const getblogs = async (req, res, next) => {
  try {
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const blogs = await Blog.find().sort({ updatedAt: sortDirection });

    const totalBlogs = await Blog.countDocuments();
    const now = new Date();
    const oneWeekAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7
    );

    const lastweekBlogs = await Blog.countDocuments({
      createdAt: { $gte: oneWeekAgo },
    });

    res.status(200).json({
      blogs,
      totalBlogs,
      lastweekBlogs,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteblog = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this"));
  }
  try {
    await Blog.findByIdAndDelete(req.params.blogId);
    res.status(200).json("Deleted");
  } catch (error) {
    next(error);
  }
};

export const updateblog = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this blog"));
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.blogId,
      {
        $set: {
          title: req.body.title,
          uploadLink: req.body.uploadLink,
          content: req.body.content,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedBlog);
  } catch (error) {
    next(error);
  }
};
