import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    TwoFASecret: {
        type: String,
        default: null,
    },
    TwoFAActive: {
        type: Boolean,
        default: false
    },
    recoveryCodes: [
        {
            type: String,
            unique: true
        }
    ]
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(process.env.SALT);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);