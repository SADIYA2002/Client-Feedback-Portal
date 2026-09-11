import mongoose from "mongoose";

export const connect = async () => {
    try {
        if (!process.env.MONGO_URL) {
            console.warn("MongoDB warning: MONGO_URL is not configured.");
            return;
        }
        if (mongoose.connection.readyState >= 1) {
            return;
        }
        await mongoose.connect(process.env.MONGO_URL);
        const connection = mongoose.connection;
        connection.on("connected", () => {
            console.log("MongoDB connected");
        })
        connection.on("error", (error) => {
            console.error("MongoDB connection error:", error);
        })
    } catch (error) {
        console.log("Something went wrong");
        console.log(error);
    }
}