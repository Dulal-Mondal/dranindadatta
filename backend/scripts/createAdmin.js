const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: { type: String, unique: true },
        password: String,
        role: { type: String, default: 'patient' },
        phone: { type: String, default: '' },
        avatar: { type: String, default: '' },
        isActive: { type: Boolean, default: true },
        isVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        const User = mongoose.model('User', userSchema);

        const existing = await User.findOne({ email: 'admin@telemedicine.com' });
        if (existing) {
            await User.deleteOne({ email: 'admin@telemedicine.com' });
            console.log('Old admin removed, creating fresh...');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123456', salt);

        await User.create({
            name: 'Admin',
            email: 'admin@telemedicine.com',
            password: hashedPassword,
            role: 'admin',
            isActive: true,
            isVerified: true,
        });

        console.log('');
        console.log('Admin created successfully!');
        console.log('================================');
        console.log('Email:    admin@telemedicine.com');
        console.log('Password: admin123456');
        console.log('================================');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

createAdmin();