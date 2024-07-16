import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "Please provide a text"],
    },
    sender: {
        type: String,
        required: [true, "Please provide a sender"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    }
})

const Summary = mongoose.models.Summary || mongoose.model('Summary', summarySchema);

export default Summary;