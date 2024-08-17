import mongoose from "mongoose";

const connectionDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL_ONLINE);
        console.log(`Database Connected Successfully on ${process.env.DB_URL_ONLINE}`);
    } catch (err) {
        console.error(`Database Connection Failed: ${err.message}`);
    }
}

export default connectionDB