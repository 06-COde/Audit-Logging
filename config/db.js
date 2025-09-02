import mongoose from "mongoose";

export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error(" MONGO_URI is missing in environment variables");
    process.exit(1);
  }

  const connectWithRetry = async (retries, delay) => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(" MongoDB connected successfully");
    } catch (error) {
      if (retries === 0) {
        console.error("MongoDB connection failed. No retries left.");
        if (process.env.NODE_ENV !== "production") {
          console.error(error); 
        }
        process.exit(1);
      }

      console.warn(
        `⚠️ MongoDB connection failed. Retrying in ${delay / 1000} seconds... (${retries} retries left)`
      );
      setTimeout(() => connectWithRetry(retries - 1, delay * 2), delay);
    }
  };

  // Start first attempt: 5 retries, 2 seconds delay
  await connectWithRetry(5, 2000);

  // Graceful shutdown 
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log(" MongoDB connection closed due to app termination");
    process.exit(0);
  });
};
export default connectDB;