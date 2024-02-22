import mongoose from "mongoose";

const expertSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  specialization: {
    type: [String],
    required: true,
  },
  uploadLink: {
    type: String,
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Expert = mongoose.model('Expert', expertSchema);

export default Expert;
