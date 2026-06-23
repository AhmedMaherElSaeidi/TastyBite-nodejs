import mongoose from "mongoose";

export const launchDBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connection successful");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
