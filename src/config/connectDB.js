import mongoose from 'mongoose'

async function connectDB () {
    try {
        await mongoose.connect('mongodb://127.0.0.1/motocycle');
        console.log('Connected to database!');
    } catch(error) {
        console.log('Cannot connect to database!');
    }
}

export default connectDB;