import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Mongoose connected: ${mongoose.connection.host}`.bgGreen.white);
    } catch (error) {
        console.log(`MongoDB connection error: ${error}`.bgRed.white);
    }
};

export default connectDB;
