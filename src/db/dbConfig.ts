import mongoose from 'mongoose';

export function dbConnect() {
    try {
        mongoose.connect(process.env.MONGO_URI!, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        }).then(() => {
            console.log("MongoDb database is connected!");
        }).catch((error) => {
            console.log(error);
        });
    } catch (error) {
        console.log('Something went wrong!', error);
    }
}