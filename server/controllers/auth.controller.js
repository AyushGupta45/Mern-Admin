import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/emailService.js";

/*signup*/
let formData = {};

export const signup = async (req, res, next) => {
  const { username, phonenumber, email, password } = req.body;

  const usernameRegex = /^[a-zA-Z0-9]+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
  const phoneNumberRegex = /^\d{10}$/;

  if (!username.match(usernameRegex)) {
    return next(errorHandler(400, "Username can only contain letters and numbers."));
  }

  if (!password.match(passwordRegex)) {
    return next(errorHandler(400, "Password must meet the specified criteria."));
  }

  if (!phonenumber.match(phoneNumberRegex)) {
    return next(errorHandler(400, "Phone number must be a valid 10-digit number."));
  }

  if (!username || !phonenumber || !email || !password) {
    return next(errorHandler(400, "All fields are required."));
  }

  const token = crypto.randomBytes(20).toString("hex");
  const verificationLink = `${process.env.VERIFICATION_LINK}${token}`;

  formData = {
    token,
    username,
    phonenumber,
    email,
    password,
  };

  try {
    res.json({
      message: "Verification email sent successfully",
      token,
      username,
      phonenumber,
      email,
      password,
    });
    await sendVerificationEmail(email, verificationLink, token);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;

  try {
    if (verificationToken === formData.token) {
      const hashedPassword = bcryptjs.hashSync(formData.password, 10);
      const newUser = new User({
        username: formData.username,
        phonenumber: formData.phonenumber,
        email: formData.email,
        password: hashedPassword,
      });

      await newUser.save();
      const verifytoken = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.json({
        message: "User account created successfully",
        verifytoken,
      });
    } else {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification token." });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



/*signin*/
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All field are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      next(errorHandler(404, "Invalid Credentials"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid Credentials"));
    }

    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};



/*google auth*/
export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
