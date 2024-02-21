import { errorHandler } from "../utils/error.js";
import Expert from "../models/expert.model.js";

export const createExpert = async (req, res) => {
  const { name, degree, specialization, uploadLink } = req.body;

  if (
    !name ||
    name === "" ||
    !degree ||
    degree === "" ||
    !specialization ||
    specialization === ""
  ) {
    return next(errorHandler(400, "Please provide all fields"));
  }

  let finalUploadLink = uploadLink;
  if (!finalUploadLink || finalUploadLink === "") {
    finalUploadLink =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  }

  let expertSpecialization = [];
  if (Array.isArray(specialization)) {
    expertSpecialization = specialization.map((s) => s.trim());
  } else if (typeof specialization === "string") {
    expertSpecialization = specialization.split(",").map((s) => s.trim());
  } else {
    throw new Error("Invalid specialization format");
  }

  const newExpert = new Expert({
    name,
    degree,
    specialization: expertSpecialization,
    uploadLink: finalUploadLink,
  });

  try {
    const savedExpert = await newExpert.save();
    res
      .status(201)
      .json({ message: "Expert created successfully", expert: savedExpert });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create expert", message: error.message });
  }
};


export const getExpert = async (req, res) => {
    try {
      const experts = await Expert.find();
      res.status(200).json({ experts }); 
    } catch (e) {
      res.status(500).json({ error: "Failed to fetch experts" });
    }
  };
  

