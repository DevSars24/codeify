import mongoose, { Schema, model, models } from "mongoose";

const ContestAttemptSchema = new Schema(
  {
    userId: { type: String, required: true },
    topic: { type: String, required: true },
    correct: { type: Number, required: true },
    total: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    language: { type: String, required: true },
    
    // The new field we discussed
    difficulty: { 
      type: String, 
      enum: ['easy', 'medium', 'hard'], 
      default: 'medium' 
    },

    // Extra fields for better AI suggestions
    timeTaken: { type: Number }, // How many seconds the quiz took
    tags: [{ type: String }],    // e.g., ["Strings", "DP", "Arrays"]
  },
  { timestamps: true }
);

export default models.ContestAttempt || model("ContestAttempt", ContestAttemptSchema);