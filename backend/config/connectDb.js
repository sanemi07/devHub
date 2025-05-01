import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";


export const connectDb = async () => {
 
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
        

        console.log(`Database connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log('Error connecting to database:', error.message);
        throw  new Error('Error connecting to database');
    }
};
