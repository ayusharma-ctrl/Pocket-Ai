import mongoose from 'mongoose';

export function dbConnect() {
    try {
        mongoose.connect(process.env.MONGO_URI!)
            .then(() => {
                console.log("MongoDb database is connected!");
            })
            .catch((error) => {
                console.log(error);
            });
    } catch (error) {
        console.log('Something went wrong!', error);
    }
}