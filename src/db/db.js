import monggose from "mongoose";
import configs from "../configs/index.js";

// database connection with mongoose
const mongoConnect = async () => {
    try {
        await monggose.connect(configs.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: "hostel", // Specify the collection name here
        });
        console.log("Database successfully connected!");
    } catch (error) {
        console.log("Database connection error", error?.message);
    }
};

monggose.connection.on("connected", () => {
    console.log("Mongoose connected to Database");
});

monggose.connection.on("error", (err) => {
    console.log("Mongoose connection error", err?.message);
});

monggose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from Database");
});

process.on("SIGINT", async () => {
    await connection.close();
    process.exit(0);
});

export default mongoConnect;
