import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
        index: true
    },
    avatar: {
        type: String,
        required: [true, "Please provide photo url"],
    }
})

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;