import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import Assignment from "../models/upload.model.js";

export const test = (req, res) => {
  res.json({ message: "API is working!" });
};

/*update*/
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 7 and 20 characters")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }
    if (req.body.phonenumber) {
      if (
        req.body.phonenumber.length !== 10 ||
        !/^\d+$/.test(req.body.phonenumber)
      ) {
        return next(errorHandler(400, "Phone number must be 10 digits"));
      }
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
          phonenumber: req.body.phonenumber,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


/*delete*/
export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  }
  try {
    await Assignment.deleteMany({ userId: req.params.userId });
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User and associated assignments have been deleted");
  } catch (error) {
    next(error);
  }
};

/*signout*/
export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};

/*getusers*/
export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Not allowed"));
  }
  try {
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const users = await User.find().sort({ createdAt: sortDirection });

    const userWithoutPass = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneWeekAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7
    );

    const lastweekUsers = await User.countDocuments({
      createdAt: { $gte: oneWeekAgo },
    });

    res.status(200).json({
      users: userWithoutPass,
      totalUsers,
      lastweekUsers,
    });
  } catch (error) {
    next(error);
  }
};
