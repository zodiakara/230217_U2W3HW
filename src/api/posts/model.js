import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postsSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number },
      unit: { type: String },
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    content: { type: String, required: true },
    comments: [
      {
        comment: { type: String, required: true },
        rate: { type: Number, required: true },
        createdAt: Date,
        updatedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

export default model("Posts", postsSchema);
