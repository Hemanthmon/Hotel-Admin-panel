import mongoose from "mongoose";

const connectDB = async () => {
    try{
       const conn = await mongoose.connect(`${process.env.MONGODB_URI}/aadminpanel`);
         console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    }catch (error) {
        console.error(`Error in connecting MongoDB: ${error.message}`);
        process.exit(1);
    }
};
export default connectDB;