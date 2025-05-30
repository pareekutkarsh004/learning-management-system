import mongoose from "mongoose";

//connect to mongodb database

const connectDB= async()=>{
    mongoose.connection.on('connected',()=>console.log('Database Connected Successfully'))

    await mongoose.connect(`${process.env.MONGODB_URI}/lms`)
}

export default connectDB;