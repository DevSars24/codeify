import mongoose, { Schema, model, models } from "mongoose";

const ContestAttemptSchema = new Schema(
  {
    userId: { type: String, required: true },
    topic: { type: String, required: true },
    correct: { type: Number, required: true },
    total: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    language: { type: String, required: true },
  },
  { timestamps: true } // createdAt, updatedAt auto
);

export default models.ContestAttempt ||
  model("ContestAttempt", ContestAttemptSchema);
