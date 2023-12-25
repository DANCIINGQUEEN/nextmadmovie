import mongoose from 'mongoose';

const connectMongoDB=async()=>{
    try{
        await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI)
        console.log('MongoDB connected')
    }catch(e){
        console.log(e)
    }
}

export default connectMongoDB;