// model to store youtube video summaries
import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema({
    videoId: {
        type: String,
        required: [true, "Please provide a youtube video id"],
    },
    title: {
        type: String,
        required: [true, "Please provide a title"],
    },
    summary: {
        type: String,
        required: [true, "Please provide a summary"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
}, { timestamps: true });

summarySchema.index({ createdAt: -1 });

const YoutubeSummary = mongoose.models.YoutubeSummary || mongoose.model('YoutubeSummary', summarySchema);

export default YoutubeSummary;