import mongoose from "mongoose";

export const db_connection = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.log("Error in database connection ", error.message);
    });
};

export default db_connection;
