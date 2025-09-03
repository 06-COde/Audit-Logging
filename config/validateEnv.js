

export const validateEnv = () => {
  const errors = [];

  const normalize = (val) =>
    val ? val.toString().trim().replace(/^"(.+(?="$))"$/, "$1") : "";

  const MONGO_URI = normalize(process.env.MONGO_URI);
  const PORT = normalize(process.env.PORT);
  const JWT_SECRET = normalize(process.env.JWT_SECRET);
  const ALERT_EMAIL = normalize(process.env.ALERT_EMAIL);
  const ALERT_EMAIL_PASS = normalize(process.env.ALERT_EMAIL_PASS);
  const USE_ATLAS_SEARCH = normalize(process.env.USE_ATLAS_SEARCH);
  const ATLAS_SEARCH_INDEX = normalize(process.env.ATLAS_SEARCH_INDEX);

  // --- MongoDB ---
  if (!MONGO_URI) errors.push("MONGO_URI is required in .env file");
  else if (
    !MONGO_URI.startsWith("mongodb://") &&
    !MONGO_URI.startsWith("mongodb+srv://")
  ) {
    errors.push("MONGO_URI must be a valid MongoDB connection string");
  }

  // --- Port ---
  if (!PORT) errors.push("PORT is required in .env file");
  else if (isNaN(PORT)) errors.push("PORT must be a number");

  // --- JWT ---
  if (!JWT_SECRET) errors.push("JWT_SECRET is required in .env file");
  else if (JWT_SECRET.length < 16)
    errors.push("JWT_SECRET should be at least 16 characters long");

  // --- Email ---
  if (!ALERT_EMAIL) errors.push("ALERT_EMAIL is required in .env file");
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ALERT_EMAIL))
    errors.push("ALERT_EMAIL must be a valid email address");

  // --- Email Password ---
  if (!ALERT_EMAIL_PASS) errors.push("ALERT_EMAIL_PASS is required in .env file");
  if (/\s/.test(ALERT_EMAIL_PASS) && !/^".+"$/.test(process.env.ALERT_EMAIL_PASS))
    errors.push("ALERT_EMAIL_PASS contains spaces — wrap it in quotes in .env");

  // --- Atlas Search ---
  if (
    USE_ATLAS_SEARCH &&
    !["true", "false"].includes(USE_ATLAS_SEARCH.toLowerCase())
  ) {
    errors.push("USE_ATLAS_SEARCH must be either true or false");
  }
  if (USE_ATLAS_SEARCH.toLowerCase() === "true" && !ATLAS_SEARCH_INDEX) {
    errors.push("ATLAS_SEARCH_INDEX is required when USE_ATLAS_SEARCH is true");
  }

  // --- Exit if errors ---
  if (errors.length > 0) {
    console.error("❌ Invalid environment variables:", errors);
    process.exit(1);
  }

  console.log("✅ Environment variables validated");
};
