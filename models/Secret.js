import mongoose from 'mongoose';

const secretSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    encryptedContent: {
        type: String,
        required: true
    },
    iv: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Secret', secretSchema);