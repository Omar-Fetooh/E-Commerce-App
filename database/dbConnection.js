import mongoose from "mongoose";

const connectionDB = async () => {
    return await mongoose
        .connect(process.env.DB_URL_ONLINE)
        .then(() => console.log('Database Connected Successfully'))
        .catch(err => console.log(err))
}

export default connectionDB