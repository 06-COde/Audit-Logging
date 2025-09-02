import { body, validationResult } from "express-validator";

// Not request validation, but we can mimic it
// For env, better to check manually
export const validateEnv = () => {
  const errors = [];

  if (!process.env.MONGO_URI) {
    errors.push("MONGO_URI is required in .env file");
  } else if (!process.env.MONGO_URI.startsWith("mongodb+srv://")) {
    errors.push("MONGO_URI must be a valid MongoDB Atlas connection string");
  }

  if (!process.env.PORT) {
    errors.push("PORT is required in .env file");
  } else if (isNaN(process.env.PORT)) {
    errors.push("PORT must be a number");
  }

  if (errors.length > 0) {
    console.error("❌ Invalid environment variables:", errors);
    process.exit(1);
  }

  console.log("✅ Environment variables validated");
};
